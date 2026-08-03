# Oportunidades de Mejora — Próxima Iteración

**Proyecto**: fe-catalog-cloudforge  
**Fecha**: 2026-07-28  
**Estado**: Documentado (No implementar en este MVP Closure)

---

## Introducción

Este documento cataloga las brechas y oportunidades de mejora identificadas durante el desarrollo del MVP. Estas oportunidades **no se implementan en esta iteración** sino que quedan documentadas para planificar la próxima fase del proyecto.

Cada oportunidad incluye:
- **Descripción**: Qué es y qué problema resuelve
- **Impacto**: Alto/Medio/Bajo — qué tan crítica es para el negocio
- **Esfuerzo**: S/M/L/XL — estimación de desarrollo
- **Prioridad sugerida**: P0 (urgente) a P3 (nice-to-have)

---

## 1. Migrar a API Real de Productos

- **Descripción**: Actualmente el catálogo usa `MockCatalogRepository` que devuelve datos hardcodeados. Reemplazar con un repositorio HTTP conectado al backend `be-cloudforge` para obtener productos reales desde la base de datos.
- **Impacto**: 🔴 **Alto** — Sin esto, el catálogo no tiene datos reales
- **Esfuerzo**: L (configuración de API, tipado de respuestas, manejo de errores, paginación)
- **Prioridad**: **P0** — Requisito para producción
- **Dependencias**: `be-cloudforge` debe tener endpoint GET /api/products funcional
- **Archivos a modificar**: `src/app/features/catalog/data/mock-catalog.repository.ts` → crear `http-catalog.repository.ts`, actualizar DI en `app.config.ts`

---

## 2. Product Detail Page

- **Descripción**: No existe una vista detalle de producto. Actualmente solo se ven cards en el grid del catálogo. Crear una ruta `/product/:id` con información completa: imágenes ampliadas, especificaciones técnicas, reseñas, productos relacionados.
- **Impacto**: 🔴 **Alto** — Experiencia de usuario incompleta sin detalle de producto
- **Esfuerzo**: M (Nuevo componente + ruta + store + tests)
- **Prioridad**: **P1**
- **Nota**: La información de producto mock actual tiene fields limitados; se necesitaría expandir el modelo Product

---

## 3. Autenticación de Usuarios

- **Descripción**: No hay sistema de login/registro. Implementar autenticación con JWT, sesión persistente, rutas protegidas y manejo de tokens.
- **Impacto**: 🔴 **Alto** — Sin autenticación no hay personalización, historial de órdenes ni carrito multi-sesión
- **Esfuerzo**: XL (Registro, login, JWT, store de auth, guards, interceptors, refresh token)
- **Prioridad**: **P1**
- **Dependencias**: Be-cloudforge debe tener endpoints de auth
- **Librerías potenciales**: `@angular/common/http` interceptors ya está disponible

---

## 4. Persistencia de Carrito en Backend

- **Descripción**: El carrito solo persiste en localStorage del navegador. Si el usuario cambia de dispositivo o borra el caché, pierde el carrito. Sincronizar el carrito con una API REST en el backend.
- **Impacto**: 🔴 **Alto** — Experiencia multi-dispositivo y persistencia real
- **Esfuerzo**: M (API sync, merge de carrito local + remoto, conflictos)
- **Prioridad**: **P1**
- **Nota**: Requiere autenticación (oportunidad #3) para identificar al usuario

---

## 5. Historial de Órdenes

- **Descripción**: No hay una vista "Mis Pedidos" donde el usuario pueda ver órdenes anteriores, su estado y detalles. Crear ruta `/orders` con lista de pedidos del usuario autenticado.
- **Impacto**: 🟡 **Medio** — Funcionalidad esperada en un e-commerce
- **Esfuerzo**: M (Nuevo vertical slice + API + UI)
- **Prioridad**: **P2**
- **Dependencias**: Oportunidad #3 (autenticación) + backend con endpoint GET /api/orders

---

## 6. Internacionalización (i18n)

- **Descripción**: Todo el texto de la UI está hardcodeado en español. Implementar soporte multi-idioma (ES/EN al menos) usando Angular i18n o `@ngx-translate/core`.
- **Impacto**: 🟡 **Medio** — Limita el mercado objetivo
- **Esfuerzo**: L (Extraer strings, configurar i18n, traducciones, pruebas)
- **Prioridad**: **P2**
- **Herramienta sugerida**: Angular i18n (nativo, no requiere librería externa)

---

## 7. Paginación en Catálogo

- **Descripción**: El catálogo carga todos los productos de una vez (actualmente 6, pero con datos reales podrían ser cientos). Implementar paginación (clásica o scroll infinito) para mejorar performance y UX.
- **Impacto**: 🟡 **Medio** — Performance con datasets grandes
- **Esfuerzo**: M (Estado de paginación en store, controles UI, integración con API)
- **Prioridad**: **P2**
- **Nota**: Depende de oportunidad #1 (API real) para paginación server-side

---

## 8. Modo Oscuro/Claro Toggle

- **Descripción**: Actualmente solo existe modo oscuro (tema neón morado). Agregar toggle para alternar entre tema claro y oscuro, con persistencia de preferencia.
- **Impacto**: 🟢 **Bajo** — Mejora de accesibilidad visual
- **Esfuerzo**: S (CSS custom properties, toggle, localStorage)
- **Prioridad**: **P3**
- **Nota**: La arquitectura actual de CSS con variables custom facilita la implementación

---

## 9. Accesibilidad (a11y)

- **Descripción**: No se ha realizado una auditoría de accesibilidad. Evaluar cumplimiento de WCAG 2.1 AA: roles ARIA, navegación por teclado, contraste de colores, lectores de pantalla.
- **Impacto**: 🔴 **Alto** — Requisito legal en muchos países, inclusión
- **Esfuerzo**: L (Auditoría + fixes en componentes + tests automatizados a11y)
- **Prioridad**: **P1**
- **Herramientas**: axe-core, Lighthouse, Playwright accessibility snapshots

---

## 10. PWA (Progressive Web App)

- **Descripción**: No hay service worker, manifest ni soporte offline. Implementar funcionalidad PWA para permitir instalación y uso offline básico.
- **Impacto**: 🟡 **Medio** — Mejora significativa de UX móvil
- **Esfuerzo**: M (Service worker con Angular SW, manifest, estrategias de caché)
- **Prioridad**: **P2**
- **Herramienta**: `@angular/service-worker` (nativo)

---

## 11. Analytics

- **Descripción**: No hay tracking de eventos del usuario (add to cart, checkout, conversión). Implementar analytics con GA4, Plausible o similar para medir funnel de conversión.
- **Impacto**: 🟡 **Medio** — Sin datos no se puede optimizar el producto
- **Esfuerzo**: M (Integración + eventos en componentes clave + dashboard)
- **Prioridad**: **P2**
- **Nota**: Requiere definir eventos clave con el equipo de producto

---

## 12. SEO (Meta Tags, SSR)

- **Descripción**: No hay meta tags dinámicos (title, description, Open Graph) ni SSR. Los motores de búsqueda no pueden indexar el contenido del catálogo correctamente.
- **Impacto**: 🟡 **Medio** — Visibilidad en buscadores
- **Esfuerzo**: L (Angular Universal/Hybrid rendering, meta service, sitemap)
- **Prioridad**: **P2**
- **Herramienta**: Angular SSR (nativo en Angular 22+)

---

## 13. Performance Budget

- **Descripción**: No hay medición de performance en CI. Establecer umbrales de rendimiento (Lighthouse scores, bundle size, time-to-interactive) que se verifiquen en el pipeline CI/CD.
- **Impacto**: 🟢 **Bajo** — Preventivo, evita regresiones de performance
- **Esfuerzo**: S (Configuración de Lighthouse CI o similar en pipeline)
- **Prioridad**: **P3**
- **Herramienta**: `@lhci/cli` (Lighthouse CI), Angular budgets (ya configurados parcialmente en `angular.json`)

---

## Resumen de Priorización

| Prioridad | Oportunidades | Esfuerzo Total |
|-----------|--------------|----------------|
| **P0** | #1 API real | L |
| **P1** | #2 PDP, #3 Auth, #4 Carrito backend, #9 Accesibilidad | XL + M + M + L |
| **P2** | #5 Historial, #6 i18n, #7 Paginación, #10 PWA, #11 Analytics, #12 SEO | M + L + M + M + M + L |
| **P3** | #8 Toggle tema, #13 Performance Budget | S + S |

---

## Notas Adicionales

- **Esfuerzo**: S = < 1 semana, M = 1-2 semanas, L = 2-4 semanas, XL = > 4 semanas
- **Dependencias**: Varias oportunidades dependen de otras (ej. Historial depende de Auth)
- **Estimaciones**: Son preliminares y deben refinarse con el equipo de desarrollo
- **Este documento no constituye un compromiso de implementación** — es una guía para la planificación de la próxima iteración
