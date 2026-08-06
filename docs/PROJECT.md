# Project: fe-catalog-cloudforge

## Architecture
- **Framework**: Angular Standalone Components (Latest).
- **Architecture Pattern**: Clean Architecture + Vertical Slices (Domain, Infrastructure, Application/UI inside each slice).
- **State Management**: Angular Signals exclusively (Writable signals, Computed signals, Custom signal stores).
- **Styling**: Bootstrap + Custom Dark Purple/Neon Theme + Material Design 3 guidelines.
- **Testing**: Playwright E2E opaque-box test suite.

## Code Layout
```
src/
├── app/
│   ├── core/                  # Base classes, HTTP interceptors, shared models
│   ├── shared/                # Shared UI components, pipes, directives
│   ├── features/
│   │   ├── catalog/           # Catalog Vertical Slice (domain, data, ui)
│   │   ├── cart/              # Cart Vertical Slice (domain, state, ui)
│   │   └── checkout/          # Checkout Vertical Slice (domain, api integration, ui)
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
└── styles.scss                # Global styles, Bootstrap overrides, neon theme
```

## Interface Contracts

### Product Model (Reference: `fe-cloudforge`)
- `id`: string / number
- `name`: string
- `description`: string
- `price`: number
- `category`: string
- `imageUrl`: string
- `stock`: number

### Cart Item Model
- `product`: Product
- `quantity`: number

### Order Payload (Reference: `be-cloudforge`)
- `items`: `{ productId: string | number, quantity: number, price: number }[]`
- `customer`: `{ name: string, email: string, address: string, city: string, zipCode: string }`
- `totalAmount`: number

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M0 | Reference Code & API Analysis | Analyze `fe-cloudforge` & `be-cloudforge` | None | DONE |
| E2E | E2E Testing Suite Creation | Playwright tests (Tiers 1-4) | None | DONE |
| M1 | Core Angular App & Infra | Angular setup, Signals store base, Bootstrap styling | M0 | DONE |
| M2 | Catalog Vertical Slice | Mocked product repo, Signals store, Catalog UI | M1 | DONE |
| M3 | Cart Vertical Slice | Signals cart store, UI drawer/page | M2 | DONE |
| M4 | Checkout Vertical Slice | Backend integration with `be-cloudforge` REST API | M3, M0 | DONE |
| M5 | UI/UX & Neon Theme Hardening | Dark purple aesthetic, Bootstrap layout, M3 design | M2, M3, M4 | DONE |
| M6 | Final E2E Pass & Coverage Hardening | Pass 100% Playwright tests & Tier 5 whitebox tests | All | DONE |
