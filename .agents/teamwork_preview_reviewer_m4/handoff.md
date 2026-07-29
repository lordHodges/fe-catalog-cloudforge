# Handoff Report — Milestone M4 Code Review

## 1. Observation

### Codebase Inspection
- **Domain & Repository**:
  - `src/app/features/checkout/domain/order.model.ts`: Defines `CustomerInfo`, `OrderItemPayload`, `CreateOrderPayload`, `OrderConfirmation`.
  - `src/app/features/checkout/data/order.repository.ts`: Abstract base class `OrderRepository`.
  - `src/app/features/checkout/data/http-order.repository.ts`: Implements `POST /api/orders` endpoint contract using `HttpClient` and maps server response to `OrderConfirmation`.
- **State Management**:
  - `src/app/features/checkout/state/checkout.store.ts`: Angular Signals `orderStatus`, `isSubmitting`, `errorMessage`, `orderConfirmation`, `isSuccess`, `isError`. Resets via `resetCheckout()`, triggers order creation via `submitOrder()`, and clears cart on success.
- **UI & Styling**:
  - `src/app/features/checkout/ui/checkout.component.ts`: Form template with dark purple neon glassmorphism styling (`.border-cyan-glow`, `.glass-input`, `.btn-neon-cyan`).
  - Required Playwright attributes present: `data-testid="checkout-form"`, `customer-name`, `customer-email`, `customer-address`, `customer-city`, `customer-zip`, `submit-order-btn`, `order-confirmation`, `order-success`.
- **App Configuration & Routing**:
  - `src/app/app.config.ts`: Provides `{ provide: OrderRepository, useClass: HttpOrderRepository }`.
  - `src/app/app.routes.ts`: Configures lazy route `/checkout`.

### Execution Output & Tool Results
- **Unit Tests**:
  - Command: `NG_CLI_ANALYTICS=false npx ng test --watch=false`
  - Result: 11 passed (11 test files), 58 passed (58 tests), 0 failed.
- **Production Build**:
  - Command: `NG_CLI_ANALYTICS=false npm run build`
  - Result: Application bundle generation completed successfully in 8.29s (0 errors).
- **Playwright E2E Tests**:
  - Command 1: `npx playwright test e2e/checkout.spec.ts`
    - Result: 2 passed, 1 failed (`TC-CHK-03`).
    - Error log: `TC-CHK-03: Test timeout of 30000ms exceeded` waiting for `locator('[data-testid="submit-order-btn"]')` to become enabled.
  - Command 2: `npx playwright test`
    - Result: 14 passed, 3 failed (`TC-CHK-03`, `TC-EDGE-02`, `TC-EDGE-03`).
    - Error log: `TC-EDGE-02` and `TC-EDGE-03` failed with 30,000ms timeouts on `submitBtn.click()`.

---

## 2. Logic Chain

1. `CheckoutComponent` binds the `disabled` property of `submit-order-btn` to `[disabled]="cartService.isEmpty() || checkoutStore.isSubmitting()"`.
2. `CartService` stores cart state in `readonly cartItems = signal<CartItem[]>([])` in memory.
3. In Playwright E2E tests `TC-CHK-03`, `TC-EDGE-02`, and `TC-EDGE-03`, the test adds an item to cart on `/` and then executes `await page.goto('/checkout')`.
4. Direct URL navigation (`page.goto('/checkout')`) reloads the browser tab, destroying the SPA in-memory heap and re-initializing `CartService` with `cartItems = []`.
5. Because `cartItems` is empty, `cartService.isEmpty()` is `true`, so `submit-order-btn` remains `disabled`.
6. Playwright's `click()` action waits up to 30,000ms for the button to become enabled. Because the cart is empty on reload, the button never enables, resulting in a test timeout.

---

## 3. Caveats

- Unit tests (`ng test`) mock `OrderRepository` and `CartService` directly within Angular TestBed without performing browser route reloads, which is why all unit tests pass cleanly.
- The issue is specifically at the integration boundary between direct route reloads and in-memory signal state persistence.

---

## 4. Conclusion

- **Verdict**: **REQUEST_CHANGES**
- Code structure, Signals state management, REST contracts, and neon UI styling are compliant.
- Fix required: Persist `CartService` state (e.g., in `localStorage`) or adjust direct route navigation handling so that cart signal state survives page reloads and E2E checkout submission succeeds without button disable timeouts.

---

## 5. Verification Method

To verify resolution:
1. Run unit tests: `NG_CLI_ANALYTICS=false npx ng test --watch=false` (must pass 58/58 tests).
2. Run build: `NG_CLI_ANALYTICS=false npm run build` (must pass with 0 errors).
3. Run Playwright checkout spec: `npx playwright test e2e/checkout.spec.ts` (must pass 3/3 tests).
4. Run full Playwright test suite: `npx playwright test` (must pass 17/17 tests).
