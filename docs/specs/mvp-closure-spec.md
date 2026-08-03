# Open-Spec: MVP Closure — Adversarial Hardening, CI/CD & Victory Audit

## Metadata
- **Version**: 1.0
- **Fecha**: 2026-07-28
- **Proyecto**: fe-catalog-cloudforge
- **Fase**: MVP Closure (M6+)
- **Estado**: Aprobado
- **Autor**: AI Agent (Spec Creator)

---

## Purpose

Cerrar formalmente el MVP de `fe-catalog-cloudforge` completando el endurecimiento adversarial (M6), estableciendo un pipeline CI/CD funcional, documentando oportunidades de mejora para la próxima iteración, y ejecutando una auditoría final de verificación (Victory Audit) que confirme el cumplimiento de todos los criterios de aceptación del MVP.

Este spec **no introduce nuevas funcionalidades**. Su objetivo es estabilizar, verificar y documentar el estado actual del proyecto.

---

## Scope

### In Scope
1. **M6 - Adversarial Hardening Completion**: Finalizar el análisis de brechas (gap analysis) de los 3 challengers lanzados en M6, verificar que los 5 tests adversariales E2E existentes pasan, identificar cobertura adicional faltante, y asegurar 100% pass rate en todos los tests (unitarios + E2E).
2. **CI/CD Pipeline**: Implementar un pipeline CI/CD basado en GitHub Actions, inspirado en el proyecto referencia `fe-cloudforge`, que ejecute lint, tests unitarios (Vitest), build de producción, y tests E2E con Playwright.
3. **Documentación de Oportunidades de Mejora**: Catalogar y documentar las brechas identificadas como oportunidades para la próxima iteración (sin implementar).
4. **Victory Audit**: Verificación final de cumplimiento de todos los acceptance criteria del MVP, sin regresiones.

### Out of Scope
- Nuevas funcionalidades o features (ej. Product Detail Page, autenticación)
- Proxy de desarrollo
- Modificaciones a la implementación existente que no sean estrictamente necesarias para pasar tests
- Integración con servicios externos adicionales

---

## Current State Analysis

### Test Suite Status Summary

| Tipo | Archivos | Tests | Estado Esperado |
|------|----------|-------|-----------------|
| **Unit Tests (Vitest)** | 11 spec files | ~190 tests | ✅ 100% pass |
| **E2E Tiers 1-4** (catalog, cart, edge-cases, checkout) | 4 spec files | 16 tests | ✅ 100% pass |
| **E2E Tier 5** (adversarial) | 1 spec file | 5 tests | ✅ 100% pass |
| **Total** | 16 spec files | ~211 tests | ✅ 100% pass |

### E2E Test Inventory

| Test ID | Nombre | Tier | Estado |
|---------|--------|------|--------|
| TC-CAT-01 | Catalog page loading & product grid | T1 | ✅ Implementado |
| TC-CAT-02 | Cart badge Signals reactive update | T1 | ✅ Implementado |
| TC-CAT-03 | Category filtering | T1 | ✅ Implementado |
| TC-CAT-04 | Stock status indicators | T1 | ✅ Implementado |
| TC-EDGE-01 | Empty cart state | T2 | ✅ Implementado |
| TC-EDGE-02 | Required field validation | T2 | ✅ Implementado |
| TC-EDGE-03 | Invalid email format | T2 | ✅ Implementado |
| TC-EDGE-04 | Stock boundaries | T2 | ✅ Implementado |
| TC-EDGE-05 | Out of stock indicator | T2 | ✅ Implementado |
| TC-CART-01 | Cart drawer toggle | T3 | ✅ Implementado |
| TC-CART-02 | Item display & subtotal | T3 | ✅ Implementado |
| TC-CART-03 | Quantity increment/decrement | T3 | ✅ Implementado |
| TC-CART-04 | Item removal | T3 | ✅ Implementado |
| TC-CART-05 | Multiple distinct products | T3 | ✅ Implementado |
| TC-CHK-01 | Checkout form fields | T4 | ✅ Implementado |
| TC-CHK-02 | Complete user journey (E2E) | T4 | ✅ Implementado |
| TC-CHK-03 | Cart clear after successful checkout | T4 | ✅ Implementado |
| TC-ADV-E2E-01 | Burst protection (double-click) | T5 | ✅ Implementado |
| TC-ADV-E2E-02 | Network failure / 500 recovery | T5 | ✅ Implementado |
| TC-ADV-E2E-03 | Empty cart submission prevention | T5 | ✅ Implementado |
| TC-ADV-E2E-04 | XSS injection in form fields | T5 | ✅ Implementado |
| TC-ADV-E2E-05 | Stock clamping at maximum | T5 | ✅ Implementado |

### Unit Test Inventory

| Archivo | Tests | Coverage Area |
|---------|-------|---------------|
| `app.spec.ts` | ~? | App component smoke |
| `core/cart.service.spec.ts` | ~? | Core cart service (re-export) |
| `features/cart/state/cart.service.spec.ts` | ~? | Cart state management |
| `features/cart/ui/cart-drawer.component.spec.ts` | ~? | Cart drawer UI |
| `features/catalog/catalog.component.spec.ts` | ~? | Catalog component |
| `features/catalog/state/catalog.store.spec.ts` | ~? | Catalog store |
| `features/catalog/data/mock-catalog.repository.spec.ts` | ~? | Mock repository |
| `features/checkout/domain/order.model.spec.ts` | ~? | Order model |
| `features/checkout/state/checkout.store.spec.ts` | ~? | Checkout store |
| `features/checkout/ui/checkout.component.spec.ts` | ~? | Checkout UI |
| `features/checkout/data/http-order.repository.spec.ts` | ~? | HTTP repository |

### Challenger M6 Status

| Challenger | Estado | Progreso |
|------------|--------|----------|
| `challenger_m6` | 🔄 Iniciado | Briefing creado, gap analysis no finalizado |
| `challenger_m6_1` | 🔄 Iniciado | Briefing creado, gap analysis no finalizado |
| `challenger_m6_2` | 🔄 Iniciado | Briefing creado, gap analysis no finalizado |

**Ninguno completó gap_report.md ni handoff.md.**

---

## Functional Requirements

### FR1: M6 Adversarial Hardening Completion

**ID**: FR-M6-01  
**Descripción**: Completar el gap analysis de los 3 challengers lanzados.  
**Detalle**:
- El agente debe revisar los briefings existentes en `.agents/challenger_m6/`, `.agents/challenger_m6_1/` y `.agents/challenger_m6_2/`.
- Ejecutar los 5 tests adversariales (`e2e/adversarial-tier5.spec.ts`) y verificar que pasan al 100%.
- Realizar white-box analysis del código fuente para identificar gaps de cobertura adversarial adicionales.
- Generar `gap_report.md` y `handoff.md` en el directorio `.agents/challenger_m6/`.

**Criterios de Aceptación**:
- [ ] Los 5 tests adversariales E2E (TC-ADV-E2E-01 a 05) pasan correctamente.
- [ ] `gap_report.md` existe con:
  - Análisis de cobertura actual vs. ataque adversarial
  - Gaps identificados (si los hay)
  - Recomendaciones priorizadas
- [ ] `handoff.md` existe con:
  - Resumen del trabajo realizado
  - Estado final de los tests
  - Recomendaciones para siguiente iteración

---

**ID**: FR-M6-02  
**Descripción**: Identificar y cubrir gaps de cobertura adversarial adicionales.  
**Detalle**:
- Revisar unit tests existentes para identificar estados no cubiertos:
  - Corrupción de localStorage
  - Payloads inválidos en checkout
  - Transiciones de estado inválidas en signals
  - Condiciones de carrera en signals
  - Edge cases con productos sin stock, precios cero, etc.
- Si se detectan gaps significativos, implementar tests adicionales (unitarios y/o E2E).
- No modificar código de implementación, solo tests.

**Criterios de Aceptación**:
- [ ] Análisis de cobertura adversarial completado.
- [ ] Tests adicionales implementados para gaps críticos (si aplica).
- [ ] Todos los tests (unitarios + E2E) pasan al 100%.

---

**ID**: FR-M6-03  
**Descripción**: Asegurar 100% pass rate en todos los tests.  
**Detalle**:
- Ejecutar `npx vitest run` (unit tests) y confirmar 0 fallos.
- Ejecutar `npx playwright test` (E2E) y confirmar 0 fallos.
- Ejecutar `ng build` y confirmar build exitoso sin errores.
- Registrar los resultados en `gap_report.md`.

**Criterios de Aceptación**:
- [ ] `npx vitest run` → 0 fallos, 100% pass.
- [ ] `npx playwright test` → 0 fallos, 100% pass.
- [ ] `ng build` → build exitoso.
- [ ] Resultados documentados.

---

### FR2: CI/CD Pipeline

**ID**: FR-CICD-01  
**Descripción**: Implementar pipeline CI/CD con GitHub Actions basado en el proyecto referencia `fe-cloudforge`.  
**Detalle**:
- Crear archivo `.github/workflows/ci.yml` con los siguientes jobs:
  1. **Lint**: Ejecutar linting (usar `prettier --check` o similar según configuración del proyecto).
  2. **Unit Tests**: Ejecutar `npx vitest run` con el runner headless en Ubuntu.
  3. **Build**: Ejecutar `ng build` en configuración production.
  4. **E2E Tests**: Ejecutar `npx playwright test` (con servidor web automático).
- Configurar triggers:
  - `push` a rama `main` (o `master`)
  - `pull_request` a rama `main` (o `master`)
- NO incluir deploy (fuera de scope del MVP; el deploy se manejará en próxima iteración).

**Criterios de Aceptación**:
- [ ] `.github/workflows/ci.yml` existe con los 4 jobs.
- [ ] Triggers configurados para push y PR a main.
- [ ] El pipeline usa `actions/checkout@v4`, `actions/setup-node@v4` con Node.js 22+.
- [ ] Cache de `node_modules` configurado.
- [ ] Job de E2E incluye `npx playwright install --with-deps` para instalar browsers.
- [ ] El pipeline NO ejecuta deploy.

---

**ID**: FR-CICD-02  
**Descripción**: Validar el pipeline CI/CD en un entorno de prueba.  
**Detalle**:
- Verificar que el workflow YAML es sintácticamente válido.
- Documentar los pasos necesarios para que un desarrollador pueda activar/hacer debug del pipeline.

**Criterios de Aceptación**:
- [ ] Sintaxis YAML válida (validable con `action-validator` o similar).
- [ ] Documentación breve de cómo verificar el pipeline.

---

### FR3: Documentación de Oportunidades de Mejora

**ID**: FR-DOC-01  
**Descripción**: Documentar las brechas identificadas como oportunidades para la próxima iteración.  
**Detalle**:
- Recopilar todas las brechas identificadas durante el desarrollo del MVP:
  1. **Mock Data**: Los datos de catálogo son simulados; migrar a API real.
  2. **Product Detail Page**: No existe vista detalle de producto (solo cards en grid).
  3. **Autenticación**: No hay login/registro de usuarios.
  4. **Persistencia de carrito en backend**: El carrito solo persiste en localStorage.
  5. **Historial de órdenes**: No hay vista de historial de pedidos del usuario.
  6. **Internacionalización (i18n)**: Solo español hardcodeado.
  7. **Paginación**: El catálogo no tiene paginación (carga todos los productos).
  8. **Modo oscuro/claro**: Solo modo oscuro, sin toggle.
  9. **Accesibilidad (a11y)**: No se auditaron estándares WCAG.
  10. **PWA**: No hay service worker ni soporte offline.
  11. **Analytics**: No hay tracking de eventos.
  12. **SEO**: No hay meta tags dinámicos ni SSR.
  13. **Performance Budget**: No hay medición de performance en CI.
- Para cada brecha incluir: descripción, impacto, esfuerzo estimado (S/M/L/XL), prioridad sugerida.

**Criterios de Aceptación**:
- [ ] Documento `specs/improvement-opportunities.md` creado con las 13+ brechas.
- [ ] Cada brecha incluye descripción, impacto, esfuerzo y prioridad.
- [ ] No se implementa ninguna de las oportunidades.

---

### FR4: Victory Audit

**ID**: FR-AUDIT-01  
**Descripción**: Verificación final de cumplimiento de todos los acceptance criteria del MVP.  
**Detalle**:
- Revisar los acceptance criteria definidos en `ORIGINAL_REQUEST.md`:
  1. ✅ La aplicación muestra una lista de productos mockeados.
  2. ✅ Los usuarios pueden agregar productos al carrito y el estado global (Signals) se actualiza correctamente.
  3. ✅ El proceso de checkout compila los datos del carrito siguiendo la estructura de orden de `fe-cloudforge`.
  4. ✅ La orden se envía exitosamente al backend (mockeado en E2E) sin errores de red o validación.
  5. ✅ El proyecto incluye configuración funcional de Playwright.
  6. ✅ Existe test E2E crítico (checkout.spec.ts) que corre exitosamente.
- Verificar que no hay regresiones:
  - `npx vitest run` → pass
  - `npx playwright test` → pass
  - `ng build` → success
- Generar reporte final `specs/victory-audit-report.md`.

**Criterios de Aceptación**:
- [ ] Todos los acceptance criteria del MVP verificados y documentados como cumplidos.
- [ ] Reporte de regresiones: 0 regresiones.
- [ ] `specs/victory-audit-report.md` generado con:
  - Estado de cada acceptance criteria (✅/❌)
  - Resultados de test suite completa
  - Estado del build
  - Firma de cierre del MVP

---

## Non-Functional Requirements

### NFR1: Testing & Quality

| ID | Requisito | Criterio |
|----|-----------|----------|
| NFR-TEST-01 | Todos los tests deben ser deterministas | 3 ejecuciones consecutivas idénticas |
| NFR-TEST-02 | Los tests E2E no deben depender de red externa | API interceptada con `page.route()` |
| NFR-TEST-03 | Cobertura adversarial mínima | 5 tests Tier 5 existentes + gaps cubiertos |
| NFR-TEST-04 | Test suite completa ejecutable en CI | `npx vitest run && npx playwright test` sin intervención manual |

### NFR2: CI/CD Pipeline

| ID | Requisito | Criterio |
|----|-----------|----------|
| NFR-CI-01 | Pipeline debe completar en < 10 min | Tiempo total optimizado con caching |
| NFR-CI-02 | Fallo en cualquier job debe detener el pipeline | `fail-fast: true` por defecto |
| NFR-CI-03 | Resultados de tests deben ser visibles en UI de GitHub | Artefactos: Playwright HTML report |

### NFR3: Documentation

| ID | Requisito | Criterio |
|----|-----------|----------|
| NFR-DOC-01 | Todos los reportes en formato Markdown | Archivos `.md` legibles |
| NFR-DOC-02 | Lenguaje: español (consistente con el proyecto) | Sin mezclar idiomas |

---

## Interfaces

### Internal Interfaces (No Cambian)

| Interfaz | Descripción |
|----------|-------------|
| `CartService` (core) | Estado global del carrito via Signals |
| `CatalogStore` | Estado del catálogo via Signals |
| `CheckoutStore` | Estado del checkout via Signals |
| `OrderRepository` | Abstracción para envío de órdenes al backend |
| `MockCatalogRepository` | Datos mock de productos |

### Filesystem Interfaces

| Ruta | Propósito |
|------|-----------|
| `.github/workflows/ci.yml` | Pipeline CI/CD |
| `.agents/challenger_m6/gap_report.md` | Gap analysis report |
| `.agents/challenger_m6/handoff.md` | Handoff report |
| `specs/improvement-opportunities.md` | Oportunidades de mejora |
| `specs/victory-audit-report.md` | Victory audit report |

### CI/CD Environment

| Variable | Valor | Propósito |
|----------|-------|-----------|
| `BASE_URL` | `http://localhost:4200` | URL base para E2E en CI |
| `CI` | `true` | Indica ejecución en CI (Playwright usa `forbidOnly`, retries) |
| `SKIP_WEBSERVER` | (no definido) | Playwright inicia servidor automáticamente |

---

## Dependencies

### External Dependencies (Existentes)

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `@playwright/test` | ^1.50.0 | Framework E2E testing |
| `vitest` | ^4.0.8 | Unit testing (via Angular build) |
| `bootstrap` | ^5.3.3 | UI framework |
| Angular CLI/Build | ^22.0.8 | Build system |

### CI/CD Dependencies

| Acción GitHub | Versión | Propósito |
|---------------|---------|-----------|
| `actions/checkout` | v4 | Checkout del repositorio |
| `actions/setup-node` | v4 | Setup Node.js |
| `actions/cache` | v4 | Cache de node_modules y Playwright |
| `actions/upload-artifact` | v4 | Subir reportes de tests |

### Project References

| Proyecto | Ruta | Propósito |
|----------|------|-----------|
| `fe-cloudforge` | `../fe-cloudforge/` | Referencia para estructura CI/CD |
| `be-cloudforge` | `../be-cloudforge/` | Backend de referencia para payloads |

---

## Acceptance Criteria

### M6 Hardening

| # | Criterio | Verificación |
|---|----------|--------------|
| AC-M6-01 | gap_report.md y handoff.md generados | Archivos existen en `.agents/challenger_m6/` |
| AC-M6-02 | 100% pass rate en unit tests | `npx vitest run` → exit code 0 |
| AC-M6-03 | 100% pass rate en E2E tests | `npx playwright test` → exit code 0 |
| AC-M6-04 | Build exitoso | `ng build` → exit code 0 |
| AC-M6-05 | Tests adversariales (Tier 5) pasan | TC-ADV-E2E-01 a 05 verificados |

### CI/CD Pipeline

| # | Criterio | Verificación |
|---|----------|--------------|
| AC-CI-01 | `.github/workflows/ci.yml` existe | Archivo presente en el repositorio |
| AC-CI-02 | Workflow contiene lint, test, build, e2e | Jobs definidos en YAML |
| AC-CI-03 | Triggers configurados | `push` y `pull_request` a main |
| AC-CI-04 | Caching de dependencias | `actions/cache` para `node_modules` y `.cache/ms-playwright` |

### Improvement Documentation

| # | Criterio | Verificación |
|---|----------|--------------|
| AC-DOC-01 | `specs/improvement-opportunities.md` existe | Archivo presente |
| AC-DOC-02 | Mínimo 10 brechas documentadas | Cada una con descripción, impacto, esfuerzo, prioridad |

### Victory Audit

| # | Criterio | Verificación |
|---|----------|--------------|
| AC-AUDIT-01 | `specs/victory-audit-report.md` existe | Archivo presente |
| AC-AUDIT-02 | Todos los AC del MVP verificados | Lista completa con checks ✅ |
| AC-AUDIT-03 | 0 regresiones detectadas | Tests existentes pasan igual que antes |
| AC-AUDIT-04 | Build de producción exitoso | `ng build` sin errores |

---

## Improvement Opportunities (Next Iteration)

*Nota: Estas oportunidades están documentadas para la próxima iteración. No implementar en este MVP Closure.*

| # | Oportunidad | Impacto | Esfuerzo | Prioridad |
|---|-------------|---------|----------|-----------|
| 1 | **Migrar a API real de productos**: Reemplazar `MockCatalogRepository` con un repositorio HTTP conectado a `be-cloudforge` | Alto | L | P0 |
| 2 | **Product Detail Page**: Vista detalle con specs, imágenes ampliadas, reviews | Alto | M | P1 |
| 3 | **Autenticación de usuarios**: Login/registro con JWT, sesión persistente | Alto | XL | P1 |
| 4 | **Persistencia de carrito en backend**: Sincronizar carrito con API en lugar de solo localStorage | Alto | M | P1 |
| 5 | **Historial de órdenes**: Vista "Mis Pedidos" con lista de órdenes anteriores | Medio | M | P2 |
| 6 | **Internacionalización (i18n)**: Soporte multi-idioma (ES/EN) con ngx-translate o Angular i18n | Medio | L | P2 |
| 7 | **Paginación en catálogo**: Carga paginada de productos con scroll infinito o paginación clásica | Medio | M | P2 |
| 8 | **Modo oscuro/claro toggle**: Switch para alternar entre temas claro/oscuro | Bajo | S | P3 |
| 9 | **Accesibilidad (a11y)**: Auditoría WCAG 2.1 AA, roles ARIA, navegación por teclado | Alto | L | P1 |
| 10 | **PWA**: Service worker, manifest, soporte offline básico | Medio | M | P2 |
| 11 | **Analytics**: Tracking de eventos (add to cart, checkout, conversión) con GA4 o similar | Medio | M | P2 |
| 12 | **SEO**: Meta tags dinámicos, SSR con Angular Universal, sitemap | Medio | L | P2 |
| 13 | **Performance Budget**: Umbrales de rendimiento en CI (Lighthouse, bundle size) | Bajo | S | P3 |

---

## Execution Plan

### Phase 1: M6 Completo (Prioridad Alta)
1. Ejecutar suite completa de tests (unit + E2E) para establecer baseline.
2. Revisar briefings de challengers M6.
3. Completar gap analysis white-box.
4. Implementar tests adversariales adicionales si se detectan gaps.
5. Verificar 100% pass rate.
6. Generar `gap_report.md` y `handoff.md`.

### Phase 2: CI/CD Pipeline (Prioridad Media)
1. Crear directorio `.github/workflows/`.
2. Implementar `ci.yml` con jobs: lint, test, build, e2e.
3. Configurar triggers y caching.
4. Validar sintaxis YAML.

### Phase 3: Documentación (Prioridad Media)
1. Generar `specs/improvement-opportunities.md`.
2. Generar `specs/victory-audit-report.md`.

### Phase 4: Victory Audit (Prioridad Media)
1. Verificar cada acceptance criteria del MVP.
2. Ejecutar suite completa de tests.
3. Build de producción.
4. Generar reporte final.

---

## Risk Assessment

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Tests adversariales fallan | Baja | Alto | Debug y fix de tests (no implementación) |
| CI Pipeline falla por configuración | Media | Medio | Validar YAML con action-validator; probar en fork |
| Gaps adversariales sin cobertura | Media | Medio | Priorizar gaps críticos; documentar resto para próxima iteración |
| Regresiones en tests existentes | Baja | Alto | Ejecutar suite completa antes y después de cambios |

---

## Artifacts

| Artefacto | Ruta | Fase |
|-----------|------|------|
| Gap Analysis Report | `.agents/challenger_m6/gap_report.md` | M6 |
| Handoff Report | `.agents/challenger_m6/handoff.md` | M6 |
| CI/CD Workflow | `.github/workflows/ci.yml` | CI/CD |
| Improvement Opportunities | `specs/improvement-opportunities.md` | Documentación |
| Victory Audit Report | `specs/victory-audit-report.md` | Victory Audit |
| **Este documento** | `specs/mvp-closure-spec.md` | Spec |

---

*Documento generado como parte del proceso de cierre del MVP de fe-catalog-cloudforge.*
