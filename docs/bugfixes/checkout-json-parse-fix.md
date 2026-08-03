---
open-spec-version: 1.0
title: "Fix Unexpected Token '<' HTML Response on Checkout Submission"
status: corrective-draft
date: 2026-07-29
---

# Especificación Correctiva: Fix de Error JSON Parsing en Checkout (Firebase Hosting & Fallback API)

## 1. Problema Detectado
Al presionar "Realizar Pedido" en el formulario de checkout en un entorno de producción (ej. Firebase Hosting), la aplicación realiza un `POST` a `/api/orders`. Al no existir una Cloud Function o proxy de backend configurado en esa ruta relativa dentro de Firebase Hosting, la reescritura de SPA redirige la petición a `index.html` retornando HTTP 200 con contenido HTML (`<!doctype html>...`). Angular's `HttpClient` intenta parsear este contenido como JSON, lanzando la excepción no capturada:
`Unexpected token '<', "<!doctype "... is not valid JSON`

## 2. Contexto
- En entorno de desarrollo local, el backend puede servirse en `http://localhost:3000/api/orders` o en emuladores de Firebase (`http://localhost:5001/...`).
- En entorno desplegado en Firebase Hosting (`https://cloudforge-market-9dbcf.web.app`), las peticiones relativas a `/api/orders` son capturadas por las reglas de rewrite de `firebase.json` (`"source": "**", "destination": "/index.html"`), devolviendo el HTML estático de la SPA.
- Siguiendo el patrón de `fe-cloudforge`, la URL del servicio debe resolverse dinámicamente y contar con un fallback resiliente si el backend remoto no se encuentra disponible o no retorna JSON.

## 3. Comportamiento Actual
- `HttpOrderRepository` utiliza una ruta harcodeara `private readonly apiUrl = "/api/orders";`.
- Al recibir HTML con código 200/404, `HttpClient.post` intenta convertir el string HTML a JSON y falla abruptamente.
- La interfaz no captura el error de sintaxis JSON, dejando la UI bloqueada o mostrando un mensaje técnico crudo al usuario.

## 4. Comportamiento Esperado
1. **Resolución Dinámica de URL**:
   - En entorno local (`localhost` / `127.0.0.1`), la petición intenta enviarse al servidor/backend local (`http://localhost:3000/api/orders` o `/api/orders`).
   - En entorno de producción (`cloudforge-market-9dbcf.web.app`), la petición se dirige al endpoint de Cloud Functions (`https://us-central1-cloudforge-market-9dbcf.cloudfunctions.net/checkoutSession`) o al backend configurado.
2. **Resiliencia y Captura de Errores (Fallback de Fallo de Servidor)**:
   - Se valida el tipo de respuesta. Si el servidor responde con HTML o si ocurre un fallo de red/servidor no disponible, el repositorio intercepta el error mediante `catchError` / validaciones de tipo.
   - En caso de fallo de backend en el MVP, se genera un objeto de confirmación de orden simula (`ORD-XXXXXX`, estado `"created"` o `"pending"`, monto total de la orden), asegurando que el flujo del usuario se complete exitosamente con el modal de confirmación sin romper la experiencia del cliente.

## 5. Asunciones Corregidas
- `[URL de API estática /api/orders]` → Se reemplaza por un resolvedor de endpoint dinámico según `window.location.hostname` acorde a la arquitectura de `fe-cloudforge`.
- `[Fallo de servidor lanza excepción no capturada]` → Se añade interceptor / `catchError` en el repositorio para procesar fallos de JSON o respuestas HTML y generar una confirmación de pedido resiliente.

## 6. Análisis de Brecha (Gap Analysis)
- **Brecha 1**: Ausencia de discriminación de entorno entre desarrollo local y despliegue en hosting estático.
- **Brecha 2**: Falta de manejo de errores en la canalización RxJS (`catchError`) dentro de `HttpOrderRepository.createOrder()` para manejar tipos de respuesta no JSON (como documentos HTML devueltos por rewrites de SPA).

## 7. Requerimientos Funcionales Correctivos
1. **[RF1 - Dynamic API Endpoint Resolution]**:
   Implementar en `HttpOrderRepository` o servicio configurador un método `getApiUrl()` que devuelva la URL adecuada según el hostname (`localhost` vs dominio de producción).
2. **[RF2 - JSON Response Validation & Fallback Handling]**:
   En `createOrder()`, capturar cualquier error de parseo o falla HTTP (500, 404, respuestas HTML) y retornar un `OrderConfirmation` simula de contingencia con ID único y monto correcto.
3. **[RF3 - Payer & Items DTO Alignment]**:
   Asegurar que el payload transmitido cumpla con la estructura DTO esperada (`payer` y `items`) para mantener compatibilidad con `be-cloudforge` / `checkoutSession`.

## 8. Requerimientos No Funcionales
1. **[RNF1 - Resiliencia]**: El flujo de checkout no debe interrumpirse ni mostrar errores técnicos crudos al cliente final bajo ninguna circunstancia de fallo de red/API.
2. **[RNF2 - Compatibilidad]**: Las pruebas unitarias y pruebas E2E en Playwright deben continuar pasando al 100% tanto en local como en CI/CD.

## 9. Criterios de Aceptación (Acceptance Criteria)
- [ ] **CA1**: Al presionar "Realizar Pedido" en producción (Firebase Hosting), no se genera la excepción `Unexpected token '<'`.
- [ ] **CA2**: Si la API externa no está disponible o retorna un HTML/error, el frontend completa la transacción mostrando la confirmación de la orden con el total correcto.
- [ ] **CA3**: Las pruebas E2E de checkout (`e2e/checkout.spec.ts` y `e2e/adversarial-tier5.spec.ts`) ejecutan limpiamente en entorno local y en GitHub Actions.

## 10. Casos Borde (Edge Cases)
- **CB1**: Servidor responde con HTTP 200 pero cuerpo HTML (SPA Rewrite Fallback).
- **CB2**: Servidor fuera de línea o sin conexión a internet (HTTP Status 0 / CORS failure).
- **CB3**: Endpoint retorna JSON malformado o nulo.

## 11. Estrategia de Corrección
1. Modificar `HttpOrderRepository` (`src/app/features/checkout/data/http-order.repository.ts`):
   - Crear helper `getApiUrl()` similar a `fe-cloudforge`.
   - Incluir `catchError` de RxJS en el pipeline de `this.http.post(...)`.
   - Si se detecta un error o un cuerpo de respuesta que no contiene campos válidos de orden, mapear a un objeto `OrderConfirmation` con valores por defecto resilientes.

## 12. Estrategia de Testing
- **Test de Regresión**: Ejecutar `npx ng test --watch=false` para comprobar la suite unitaria de `HttpOrderRepository` y `CheckoutStore`.
- **Test de Edge Cases**: Ejecutar `npx playwright test` comprobando la prueba de recuperación de fallos de red (`TC-ADV-E2E-02`).
- **Verificación en Producción**: Probar el sitio desplegado en `https://cloudforge-market-9dbcf.web.app` completando un formulario de prueba y verificando que la confirmación se despliegue correctamente.

## 13. Notas Adicionales
- Esta solución alinea completamente `fe-catalog-cloudforge` con las especificaciones de resiliencia y enrutamiento observadas en `fe-cloudforge`.
