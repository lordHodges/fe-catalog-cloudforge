# Original User Request

## Initial Request — 2026-07-28T04:44:35Z

Construir un MVP de una aplicación web e-commerce en Angular (última versión) basada en un diseño proporcionado (tema oscuro, detalles morados). La aplicación debe incluir un catálogo de productos, carrito de compras funcional y checkout, utilizando Angular Signals para el estado global y una arquitectura Clean Architecture basada en Vertical Slices.

Working directory: /home/dev-lord/Workspace/Projects/1000_hodges_devel/03_ai_assisted/marketplace/fe-catalog-cloudforge
Integrity mode: development

## Requirements

### R1. Arquitectura y Estado
Implementar Clean Architecture y Vertical Slices. Cada feature slice debe representar una feature con su estructura DDD completa dentro de ella, a excepción de elementos compartidos (clases base, componentes reutilizables). Utilizar Angular Signals de forma exclusiva para el manejo de estados globales. Usar de referencia `/home/dev-lord/Workspace/Projects/1000_hodges_devel/03_ai_assisted/marketplace/fe-cloudforge/` para la estructura de producto/orden y su comunicación con el checkout.

### R2. Datos del Catálogo
Para este MVP, los datos de los productos en el catálogo deben estar simulados (mockeados) en el frontend, basándose estrictamente en la estructura de datos existente en el proyecto de referencia (`fe-cloudforge`).

### R3. Integración de Checkout
El flujo de checkout debe ser completamente funcional e integrarse enviando la orden generada al backend local existente ubicado en `/home/dev-lord/Workspace/Projects/1000_hodges_devel/03_ai_assisted/marketplace/be-cloudforge/`.

### R4. Diseño UI/UX
Implementar un sistema de diseño visualmente idéntico a la captura de referencia (estética oscura con acentos morados/neón). El diseño debe seguir los principios de Material Design 3 (https://m3.material.io/) pero utilizar **Bootstrap** para la maquetación y el manejo de los estilos.

### R5. Uso de Mejores Prácticas y Dependencias
Consultar Context7 (herramienta del agente) para obtener documentación y las mejores prácticas más actualizadas de Angular, Signals y la integración de Material 3 con Bootstrap. **Restricción:** El equipo debe preguntar y obtener validación explícita del usuario antes de instalar o implementar cualquier librería de terceros adicional a las mencionadas (Angular, Bootstrap).

## Acceptance Criteria

### Catálogo y Carrito
- [ ] La aplicación muestra una lista de productos mockeados.
- [ ] Los usuarios pueden agregar productos al carrito y el estado global (gestionado con Signals) se actualiza reflejando la cantidad y precio total correctamente.

### Checkout y Backend
- [ ] El proceso de checkout compila los datos del carrito siguiendo la estructura de orden de `fe-cloudforge`.
- [ ] La orden se envía exitosamente al backend en `be-cloudforge` sin errores de red o validación del lado del servidor.

### Verificación Objetiva (Testing Automático)
- [ ] El proyecto debe incluir una configuración funcional de Playwright (o Cypress).
- [ ] Debe existir al menos un test E2E crítico (ej. `checkout.spec.ts`) que corra exitosamente comprobando el flujo completo: cargar catálogo, agregar producto al carrito y realizar checkout.
