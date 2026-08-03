# AGENTS.md

Este archivo sirve como punto de referencia y guía operativa para Agentes de Inteligencia Artificial que participen en el desarrollo, mantenimiento y evolución del proyecto `fe-catalog-cloudforge`.

---

## 1. Visión General del Proyecto
- **Nombre**: `fe-catalog-cloudforge`
- **Tipo**: Aplicación Frontend de E-Commerce (Catálogo de productos, Carrito de Compras y Checkout).
- **Framework**: Angular 22+ Standalone Components (Zoneless).
- **Manejo de Estado**: Angular Signals de forma exclusiva (Writable signals, Computed signals y Custom stores).
- **Estilos / Diseño**: Bootstrap 5 + Tema Oscuro Morado/Neón siguiendo las directrices de Material Design 3.
- **Testing**: Playwright para pruebas E2E (Tiers 1 a 5) y Vitest para pruebas unitarias.

---

## 2. Arquitectura y Estructura de Directorios
El proyecto implementa **Clean Architecture** estructurado mediante **Vertical Slices**:

```
src/
├── app/
│   ├── core/                  # Clases base, interceptores, modelos globales compartidos
│   ├── shared/                # Componentes comunes de la UI (Navbar, Footer)
│   ├── features/
│   │   ├── catalog/           # Slice de Catálogo (UI, store, repositorio de productos)
│   │   ├── cart/              # Slice de Carrito (UI, signal-based cart service)
│   │   └── checkout/          # Slice de Checkout (Formulario, orden, repo HTTP)
│   ├── app.component.ts       # Componente raíz
│   ├── app.config.ts          # Configuración de providers, routing, zoneless setup
│   └── app.routes.ts          # Rutas principales del aplicativo
└── styles.scss                # Estilos globales, variables de Bootstrap y acentos neón
```

---

## 3. Comandos de la Suite de Desarrollo

### Instalación y Servidor
- Instalar dependencias: `npm install`
- Correr en desarrollo local: `npm run start` o `ng serve`

### Calidad y Pruebas
- **Pruebas Unitarias (Vitest)**: `npm run test` (o `ng test --watch=false` para una sola pasada en CI)
- **Pruebas E2E (Playwright)**: `npx playwright test`
- **Linter**: `npm run lint`

### Construcción
- Build de producción: `npm run build` o `ng build`

---

## 4. Lineamientos de Desarrollo para Agentes
- **Preservar la Reactividad**: Nunca uses `RxJS` o suscripciones explícitas si se pueden resolver con `Signals` y `computed`.
- **Integridad de los Tests**: El proyecto cuenta con tests adversariales (Tier 5) en `e2e/adversarial-tier5.spec.ts` para burst protection, tolerancia a caídas de red y stock clamping. Cualquier refactorización o cambio de código debe validar que esta suite pase al 100%.
- **Sin Dependencias Ocultas**: No instales librerías de terceros adicionales sin solicitar la confirmación explícita del usuario.
- **Integridad**: Mantén siempre los comentarios existentes en el código.

---

## 5. Historial de Participación de Agentes

| Fecha | Agente | Rol / Tarea Realizada | Estado |
|-------|--------|-----------------------|--------|
| 2026-08-01 | **Antigravity (Gemini 3.5 Flash)** | Inicialización de `AGENTS.md` basado en documentación del MVP. | ✅ Completado |
