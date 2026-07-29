---
title: "Plan de Ejecución - Fix Mercado Pago Redirect y Validación DTO"
spec: "specs/mercadopago-redirect-fix.md"
date: 2026-07-29
status: planned
---

# Plan de Ejecución: Redirección Mercado Pago y Validación DTO de Checkout

## 1. Resumen de la Solución

Se corregirán dos problemas críticos en el flujo de checkout:
1. **Backend (`be-cloudforge`)**: Se flexibilizan las validaciones `@ValidateIf` en `CreateCheckoutDto` para que `payer` solo requiera la estructura de `CheckoutPayerDto` si se envía como objeto completo con dirección. Si el frontend envía `customer` o un `payer` plano, no fallará con HTTP 400. En `CreateCheckoutPreferenceUseCase`, se extraen los datos del comprador de forma segura desde `customer` o `payer`.
2. **Frontend (`fe-catalog-cloudforge`)**: Se actualiza `OrderConfirmation` para incluir `initPoint?: string`. En `HttpOrderRepository`, se deja de duplicar `payer: payload.customer` en la petición, se extrae `initPoint`, y los errores HTTP 400/422/500 con respuesta estructurada del servidor se propagan en lugar de enmascararse. En `CheckoutStore`, al recibir `initPoint`, se ejecuta `window.location.href = confirmation.initPoint` para redirigir inmediatamente al portal de Mercado Pago.

---

## 2. Fases de Ejecución

### Fase 1: Backend (`be-cloudforge`)
- **Archivo 1**: `src/features/checkout-session/application/dtos/create-checkout.dto.ts`
  - Ajustar `@ValidateIf` para `payer` y `customer`.
- **Archivo 2**: `src/features/checkout-session/application/use-cases/create-checkout-preference.use-case.ts`
  - Normalizar `payer` y `customer` de forma segura soportando `customer` plano, `payer` plano o `CheckoutPayerDto` estructurado.
- **Verificación Backend**:
  - Ejecutar tests unitarios y e2e con `npx firebase emulators:exec --only firestore "npm run test:local"`.
  - Generar tag `v1.1.1` y realizar `git push --follow-tags origin main`.

### Fase 2: Frontend (`fe-catalog-cloudforge`)
- **Archivo 1**: `src/app/features/checkout/domain/order.model.ts`
  - Agregar `initPoint?: string` a `OrderConfirmation`.
- **Archivo 2**: `src/app/features/checkout/data/http-order.repository.ts`
  - En `createOrder`: enviar `payload` directamente sin añadir `payer: payload.customer`.
  - En `buildConfirmation`: extraer `initPoint: res.init_point || res.initPoint`.
  - En `catchError`: propagar errores HTTP 400/422/500 con `throwError(() => err)` si hay respuesta del servidor.
- **Archivo 3**: `src/app/features/checkout/data/http-order.repository.spec.ts`
  - Actualizar expectations de payload en tests y añadir pruebas para `initPoint` y propagación de error 400.
- **Archivo 4**: `src/app/features/checkout/state/checkout.store.ts`
  - Al recibir `confirmation.initPoint`, redirigir vía `window.location.href = confirmation.initPoint`.
- **Verificación Frontend**:
  - Aplicar Prettier: `npx prettier --write ...`
  - Ejecutar tests unitarios: `npm test -- --watch=false`
  - Ejecutar tests E2E: `npx playwright test`
  - Compilar y desplegar a Firebase Hosting: `npm run deploy`
  - Confirmar y subir cambios a GitHub (`git commit` + `git push`).

### Fase 3: Notificación
- Enviar notificación por Telegram usando la skill `notify`.

---

## 3. Matriz de Agentes Especializados

| Agente | Alcance / Repositorio | Archivos Afectados |
|--------|----------------------|--------------------|
| **Agent-BE** | `be-cloudforge` | `create-checkout.dto.ts`, `create-checkout-preference.use-case.ts` |
| **Agent-FE** | `fe-catalog-cloudforge` | `order.model.ts`, `http-order.repository.ts`, `http-order.repository.spec.ts`, `checkout.store.ts` |
