# Implementation Plan — fe-catalog-cloudforge MVP

## Architecture Strategy
- **Framework**: Angular (latest standard standalone components & signals).
- **Architecture Pattern**: Clean Architecture with Vertical Slices (DDD per slice).
- **State Management**: Angular Signals exclusively (Signal stores / computed signals / writable signals).
- **UI System**: Bootstrap for layout & styles, dark theme with purple/neon accents, Material Design 3 guidelines.
- **Backend Integration**: Checkout order submission directly to `be-cloudforge` REST API.
- **Testing**: Playwright E2E testing suite (opaque-box, derived from user requirements).

## Milestones

### Track 1: Implementation Track
1. **M0: Codebase & Reference Analysis**: Explore `fe-cloudforge` and `be-cloudforge` to extract exact product & order models, backend endpoints, and contracts.
2. **M1: Angular Project & Shared Core Setup**: Scaffold Angular project in `fe-catalog-cloudforge`, configure Bootstrap, define core DDD base classes, shared HTTP interceptors, layout scaffolding, and Signal stores infrastructure.
3. **M2: Catalog Vertical Slice**: Implement product domain, mocked catalog data repository, catalog UI components (product list, cards, filters), signal state.
4. **M3: Cart Vertical Slice**: Implement cart domain, cart state using Signals (add, remove, update quantities, totals), cart UI drawer/modal/page.
5. **M4: Checkout Vertical Slice & Backend Integration**: Implement checkout domain, order mapping matching `be-cloudforge`, HTTP repository connecting to backend, checkout form UI & order submission flow.
6. **M5: UI/UX & Dark Purple Neon Theme Hardening**: Refine dark theme visual design (purple/neon accents, glassmorphism/M3 touches, responsive layout, polished feedback).
7. **M6: Final E2E Test Suite Pass & Adversarial Hardening**: Run full Playwright test suite against completed app, resolve any regressions, perform Tier 5 white-box coverage hardening.

### Track 2: E2E Testing Track (Parallel)
1. **E2E-M1: Test Infrastructure & Runner Setup**: Set up Playwright harness in `fe-catalog-cloudforge`, configure scripts and environment.
2. **E2E-M2: Test Case Creation (Tiers 1-4)**:
   - Tier 1: Feature Coverage (Catalog rendering, cart manipulation, checkout submission).
   - Tier 2: Boundary & Corner Cases (empty cart checkout attempt, invalid fields, max quantities).
   - Tier 3: Cross-Feature Combinations (add multiple items, modify cart during checkout, clear cart).
   - Tier 4: Real-World Scenarios (complete E2E shopping journey).
3. **E2E-M3: Publish TEST_READY.md**.
