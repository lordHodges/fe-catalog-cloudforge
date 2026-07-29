---
spec: specs/mvp-closure-spec.md
date: 2026-07-28
status: planned
---

# Plan de Implementación: MVP Closure — Adversarial Hardening, CI/CD & Victory Audit

## Resumen del Proyecto

**Proyecto**: fe-catalog-cloudforge (Angular 22 standalone + zoneless, Bootstrap 5, Angular Signals)
**Objetivo**: Cerrar formalmente el MVP completando endurecimiento adversarial (M6), pipeline CI/CD, documentación de mejoras y victory audit.
**No introduce nuevas funcionalidades**.

## Estado Actual

| Aspecto | Estado |
|---------|--------|
| Unit Tests (Vitest) | 11 spec files, ~190 tests |
| E2E Tests (Playwright) | 5 spec files, 21 tests |
| Tests Adversariales (Tier 5) | Implementados en unit tests + 5 E2E |
| Challenger M6 reports | ❌ gap_report.md y handoff.md NO existen |
| CI/CD Pipeline | ❌ `.github/workflows/` NO existe |
| Improvement Docs | ❌ `specs/improvement-opportunities.md` NO existe |
| Victory Audit | ❌ `specs/victory-audit-report.md` NO existe |

## Arquitectura Mapeada

### Estructura de directorios
```
src/
├── app/
│   ├── app.ts / app.html / app.scss / app.routes.ts / app.config.ts
│   ├── core/                    # Modelos y re-export de servicios
│   │   ├── cart.model.ts
│   │   ├── cart.service.ts       (re-export)
│   │   ├── cart.service.spec.ts
│   │   ├── checkout.model.ts
│   │   └── product.model.ts
│   ├── shared/
│   │   ├── navbar/navbar.component.ts
│   │   └── footer/footer.component.ts
│   └── features/
│       ├── catalog/             # Vertical Slice
│       │   ├── catalog.component.ts
│       │   ├── catalog.component.spec.ts
│       │   ├── domain/product.model.ts / catalog.repository.ts
│       │   ├── data/mock-catalog.repository.ts (+ spec)
│       │   ├── state/catalog.store.ts (+ spec)
│       │   └── ui/catalog.component.ts
│       ├── cart/                # Vertical Slice
│       │   ├── domain/cart.model.ts
│       │   ├── state/cart.service.ts (+ spec)
│       │   └── ui/cart-drawer.component.ts (+ spec)
│       └── checkout/            # Vertical Slice
│           ├── checkout.component.ts (re-export)
│           ├── domain/order.model.ts (+ spec)
│           ├── data/order.repository.ts / http-order.repository.ts (+ spec)
│           ├── state/checkout.store.ts (+ spec)
│           └── ui/checkout.component.ts (+ spec)
e2e/
├── adversarial-tier5.spec.ts    # 5 tests Tier 5
├── cart.spec.ts                 # 5 tests Tier 3
├── catalog.spec.ts              # 4 tests Tier 1
├── checkout.spec.ts             # 3 tests Tier 4
└── edge-cases.spec.ts           # 5 tests Tier 2
```

### Interfaces Clave
| Interfaz | Propósito |
|----------|-----------|
| `CartService` | Estado global del carrito via Signals (core) |
| `CatalogStore` | Estado del catálogo via Signals |
| `CheckoutStore` | Estado del checkout via Signals |
| `OrderRepository` | Abstracción para envío de órdenes |
| `MockCatalogRepository` | Datos mock de productos |

## Fases de Ejecución

### Fase 0 — Baseline & Discovery (secuencial)
1. Ejecutar test suite completa para establecer baseline: `ng test`, `playwright test`, `ng build`
2. Verificar que tests adversariales Tier 5 E2E pasan
3. Revisar briefings de challengers M6, M6_1, M6_2

### Fase 1 — M6 Adversarial Hardening (secuencial)
1. Realizar white-box analysis del código fuente para identificar gaps de cobertura
2. Implementar tests adversariales adicionales si se detectan gaps (solo tests, NO implementación)
3. Verificar 100% pass rate
4. Generar `.agents/challenger_m6/gap_report.md`
5. Generar `.agents/challenger_m6/handoff.md`

### Fase 2 — CI/CD Pipeline (independiente de Fase 1)
1. Crear directorio `.github/workflows/`
2. Implementar `ci.yml` con 4 jobs: lint, test, build, e2e
3. Configurar triggers (push y PR a main)
4. Configurar caching de node_modules y Playwright browsers

### Fase 3 — Documentación (independiente de Fase 1 y 2)
1. Generar `specs/improvement-opportunities.md` con 13 brechas documentadas
2. Cada brecha: descripción, impacto, esfuerzo (S/M/L/XL), prioridad sugerida

### Fase 4 — Victory Audit (depende de Fases 1-3 completadas)
1. Verificar cada acceptance criteria del MVP (de ORIGINAL_REQUEST.md)
2. Ejecutar suite completa: `ng test` + `playwright test` + `ng build`
3. Generar `specs/victory-audit-report.md`

## Matriz de Agentes

| Agente | Fase | Archivos a crear/modificar | Descripción |
|--------|------|---------------------------|-------------|
| **Agente A: Baseline Verification** | 0 | (ninguno, solo ejecución) | Ejecutar tests baseline: unit, E2E, build |
| **Agente B: White-box Analysis** | 1 | (ninguno, solo lectura) | Analizar código fuente para gaps adversariales |
| **Agente C: Adversarial Tests** | 1 | Archivos de test `.spec.ts` existentes | Implementar tests adversariales adicionales si hay gaps |
| **Agente D: CI/CD Pipeline** | 2 | `.github/workflows/ci.yml` | Crear pipeline CI/CD completo |
| **Agente E: Improvement Docs** | 3 | `specs/improvement-opportunities.md` | Documentar 13 brechas de mejora |
| **Agente F: Victory Audit** | 4 | `specs/victory-audit-report.md` | Verificar ACs y generar reporte final |
| **Agente G: Gap Report & Handoff** | 1 | `.agents/challenger_m6/gap_report.md`, `.agents/challenger_m6/handoff.md` | Reportes de cierre M6 |

## Paralelismo

| Trabajo en paralelo | Agentes |
|---------------------|---------|
| Lote 1 (independientes) | B (análisis), D (CI/CD), E (documentación) |
| Lote 2 (depende de B) | C (tests adversariales) |
| Lote 3 (depende de C) | G (gap report + handoff) |
| Lote 4 (depende de todos) | F (victory audit) |

## Criterios de Aceptación a Verificar

| ID | Criterio | Verificación |
|----|----------|--------------|
| AC-M6-01 | gap_report.md y handoff.md generados | Archivos existen |
| AC-M6-02 | 100% pass rate en unit tests | `ng test --watch=false` → exit 0 |
| AC-M6-03 | 100% pass rate en E2E tests | `playwright test` → exit 0 |
| AC-M6-04 | Build exitoso | `ng build` → exit 0 |
| AC-M6-05 | Tests adversariales (Tier 5) pasan | TC-ADV-E2E-01 a 05 verificados |
| AC-CI-01 | `.github/workflows/ci.yml` existe | Archivo presente |
| AC-CI-02 | Workflow contiene lint, test, build, e2e | Jobs definidos |
| AC-CI-03 | Triggers configurados | push y PR a main |
| AC-CI-04 | Caching de dependencias | actions/cache configurado |
| AC-DOC-01 | `specs/improvement-opportunities.md` existe | Archivo presente |
| AC-DOC-02 | Mínimo 10 brechas documentadas | Cada una con descripción, impacto, esfuerzo, prioridad |
| AC-AUDIT-01 | `specs/victory-audit-report.md` existe | Archivo presente |
| AC-AUDIT-02 | Todos los AC del MVP verificados | Lista completa con checks |
| AC-AUDIT-03 | 0 regresiones detectadas | Tests pasan igual que antes |
| AC-AUDIT-04 | Build de producción exitoso | `ng build` sin errores |

## Artefactos de Salida

| Artefacto | Ruta |
|-----------|------|
| Plan de Implementación | `docs/mvp-closure-spec-Plan.md` |
| Gap Analysis Report | `.agents/challenger_m6/gap_report.md` |
| Handoff Report | `.agents/challenger_m6/handoff.md` |
| CI/CD Workflow | `.github/workflows/ci.yml` |
| Improvement Opportunities | `specs/improvement-opportunities.md` |
| Victory Audit Report | `specs/victory-audit-report.md` |

## Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Tests adversariales fallan | Baja | Alto | Debug y fix de tests (no implementación) |
| CI Pipeline falla por sintaxis YAML | Media | Medio | Validar YAML manualmente |
| Regresiones en tests existentes | Baja | Alto | Ejecutar suite completa antes y después |
