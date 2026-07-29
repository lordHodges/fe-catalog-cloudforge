---
open-spec-version: 1.0
title: "Fix Mercado Pago Redirect and Backend DTO Validation on Checkout"
status: corrective-draft
date: 2026-07-29
---

# Especificación Correctiva: Redirección a Mercado Pago y Validación DTO en Checkout

## 1. Problema Detectado
Al presionar "Realizar Pedido" en la pantalla de checkout:
1. El backend `be-cloudforge` retorna HTTP 400 (`Validation failed` en la propiedad `payer`) debido a que `@ValidateIf` forzaba la validación de `payer` con `CheckoutPayerDto` (el cual exige `first_name`, `last_name`, `phone` y `address: ChileanAddressDto`) a pesar de que el frontend enviaba un objeto `customer` o un `payer` plano.
2. Al recibir un error HTTP 400, el repositorio frontend `HttpOrderRepository` capturaba cualquier error no-500 y retornaba un objeto de confirmación ficticio, lo que provocaba que la aplicación renderizara de inmediato la pantalla de "¡Gracias por tu compra!" en lugar de mostrar el error o redirigir a la pasarela de pago.
3. El frontend no manejaba el campo `init_point` / `initPoint` retornado por la API de checkout para ejecutar `window.location.href = init_point` hacia el portal de pago de Mercado Pago.

## 2. Contexto
- El flujo de pago con Mercado Pago exige que al enviar la orden al endpoint `checkoutSession`:
  - El backend valide flexiblemente el DTO de entrada (aceptando `customer` plano o `payer`).
  - El backend genere la preferencia en Mercado Pago y retorne `{ init_point: "https://www.mercadopago.cl/...", order_id: "..." }`.
  - El frontend procese `init_point` y redirija al usuario al portal de pago de Mercado Pago.
  - Tras completar el pago en Mercado Pago, las URL de retorno configuradas (o webhooks) devuelven al usuario a la vista de agradecimiento.

## 3. Comportamiento Actual
- `CreateCheckoutDto` en `be-cloudforge` rechaza payloads con `payer` plano o `customer` con error 400.
- `HttpOrderRepository` en `fe-catalog-cloudforge` añade `payer: payload.customer` duplicando el objeto y haciendo que falle la validación DTO del backend.
- `HttpOrderRepository` captura errores 400/404 y los convierte en confirmación exitosa simulada ("Gracias por tu compra").
- No existe instrucción de redirección `window.location.href = initPoint` tras recibir la respuesta de la API.

## 4. Comportamiento Esperado
1. **Validación DTO Flexible en Backend (`be-cloudforge`)**:
   - `CreateCheckoutDto` acepta payloads con `customer` `{ name, email, address, city, zipCode }` sin exigir `CheckoutPayerDto` estricto a menos que `payer` venga con la estructura completa de `ChileanAddressDto`.
   - `CreateCheckoutPreferenceUseCase` convierte transparentemente `customer` o `payer` plano a la estructura `payer` requerida por el adaptador de Mercado Pago (`first_name`, `last_name`, `address: ChileanAddressDto`).
2. **Redirección a Mercado Pago en Frontend (`fe-catalog-cloudforge`)**:
   - `HttpOrderRepository` envía el payload `{ items, customer, totalAmount }` sin forzar la duplicación con `payer`.
   - `HttpOrderRepository` preserva `initPoint` / `init_point` en el objeto de confirmación de la orden.
   - Si la respuesta contiene `initPoint`, `CheckoutStore` / `CheckoutComponent` redirige inmediatamente al usuario a la URL de Mercado Pago (`window.location.href = initPoint`).
   - Los errores HTTP (incluyendo 400 Validation Failed) se propagan como error real para mostrar el mensaje de alerta en el formulario de checkout en lugar de fingir éxito.

## 5. Asunciones Corregidas
- `[DTO de Checkout exige payer.address como objeto en todo payload]` → Ajustado para validar `payer` sólo si es un objeto estructurado `CheckoutPayerDto` y aceptar `customer` plano de forma limpia.
- `[Respuesta de checkout muestra siempre vista local de gracias]` → Ajustado para redirigir a `init_point` de Mercado Pago cuando la pasarela retorna la URL de pago.
- `[Errores 400 de API se enmascaran como compra exitosa]` → Ajustado para propagar errores 400 al usuario.

## 6. Análisis de Brecha (Gap Analysis)
- **Brecha 1**: `@ValidateIf` en `CreateCheckoutDto` se activaba erróneamente cuando la propiedad `payer` estaba presente como objeto plano.
- **Brecha 2**: Ausencia de lógica de navegación externa (`window.location.href = initPoint`) al recibir la preferencia de Mercado Pago.
- **Brecha 3**: Manejo de errores excesivamente permisivo en `HttpOrderRepository.createOrder()` que enmascaraba fallos 400 como transacciones exitosas.

## 7. Requerimientos Funcionales Correctivos
1. **[RF1 - Flexible Class-Validator Constraints in Backend]**:
   Actualizar `CreateCheckoutDto` en `be-cloudforge` para utilizar `@ValidateIf` condicional sobre `payer` (validar como `CheckoutPayerDto` solo si `payer.address` es un objeto).
2. **[RF2 - Order Confirmation & Mercado Pago Redirect]**:
   Actualizar `OrderConfirmation` en `fe-catalog-cloudforge` para incluir `initPoint?: string`.
   En `CheckoutComponent` / `CheckoutStore`, al recibir `initPoint`, ejecutar la redirección al portal de Mercado Pago.
3. **[RF3 - Error Propagation]**:
   En `HttpOrderRepository`, no capturar errores HTTP 400/422/500 con el fallback ficticio si la API responde con un objeto de error estructurado, permitiendo que el formulario muestre el mensaje retornado por el servidor.

## 8. Requerimientos No Funcionales
1. **[RNF1 - Integración]**: El flujo completo debe ser compatible con las credenciales de prueba de Mercado Pago.
2. **[RNF2 - Tests]**: Todas las pruebas unitarias y E2E de frontend y backend deben mantenerse pasando.

## 9. Criterios de Aceptación (Acceptance Criteria)
- [ ] **CA1**: El endpoint `/checkoutSession` retorna 201 Created con `{ init_point: "https://...", order_id: "..." }` al enviar un payload con `customer`.
- [ ] **CA2**: El frontend redirige automáticamente al navegador a la URL `init_point` de Mercado Pago.
- [ ] **CA3**: Si el backend retorna error 400, la UI muestra la alerta con el mensaje de error en lugar de la pantalla de agradecimiento.

## 10. Casos Borde (Edge Cases)
- **CB1**: Payload con `customer` y `payer` simultáneamente.
- **CB2**: Mercado Pago no retorna `init_point` (fallback a vista de gracias/orden interna).
- **CB3**: Error de red total (CORS/offline) mantiene el fallback de contingencia.

## 11. Estrategia de Corrección
1. **En Backend (`be-cloudforge`)**:
   - Modificar `src/features/checkout-session/application/dtos/create-checkout.dto.ts` ajustando las condiciones `@ValidateIf` para `payer` y `customer`.
   - Modificar `create-checkout-preference.use-case.ts` para que extraiga datos del comprador desde `dto.customer` o `dto.payer` de manera segura.
2. **En Frontend (`fe-catalog-cloudforge`)**:
   - Modificar `src/app/features/checkout/domain/order.model.ts` para agregar `initPoint?: string`.
   - Modificar `src/app/features/checkout/data/http-order.repository.ts` para enviar solo `payload` sin duplicar `payer`, capturar `init_point`, y propagar errores 400.
   - Modificar `src/app/features/checkout/ui/checkout.component.ts` o `checkout.store.ts` para ejecutar `window.location.href = confirmation.initPoint` cuando exista `initPoint`.

## 12. Estrategia de Testing
- Pruebas unitarias en NestJS (`npm run test:local` en `be-cloudforge`).
- Pruebas unitarias en Angular (`npm test -- --watch=false` en `fe-catalog-cloudforge`).
- Pruebas E2E en Playwright (`npx playwright test`).
- Prueba manual del flujo de checkout desplegado.
