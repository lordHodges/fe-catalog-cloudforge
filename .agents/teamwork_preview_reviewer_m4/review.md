# Code Review Report — Milestone M4 (Checkout Vertical Slice & Backend Integration)

## Review Summary

**Verdict**: REQUEST_CHANGES

**Summary**: 
The code implementation for Milestone M4 (Checkout Vertical Slice) is architecturally well-designed, featuring clean Angular Signals state management (`orderStatus`, `isSubmitting`, `errorMessage`, `orderConfirmation`), exact `be-cloudforge` REST contract mappings (`POST /api/orders`), sleek dark purple neon styling, and all 9 requested `data-testid` attributes.
Unit tests (`ng test`) pass 100% (58/58 tests passed), and production build (`npm run build`) succeeds cleanly with zero errors.

However, Playwright E2E test execution failed 3 tests (`TC-CHK-03`, `TC-EDGE-02`, `TC-EDGE-03`) with 30-second timeouts. The root cause is that `CartService` stores cart state purely in an in-memory signal without `localStorage` persistence. When E2E tests perform direct browser navigations (`await page.goto('/checkout')`), the page reloads and resets the cart signal to `[]`. This causes `checkout.component.ts` to disable the submit button (`[disabled]="cartService.isEmpty()"`), preventing Playwright from clicking the submit button.

---

## Findings

### [Major] Finding 1: Playwright E2E Test Timeout on `TC-CHK-03` (`e2e/checkout.spec.ts:127`)
- **What**: Test `TC-CHK-03: Should clear cart signal state after successful checkout submission` failed with a 30,000ms timeout on `await submitBtn.click()`.
- **Where**: `e2e/checkout.spec.ts:148`
- **Why**: Test adds an item to cart on `/`, then invokes `await page.goto('/checkout')`. Full browser navigation reloads the application and clears `CartService`'s in-memory `cartItems` signal. `CheckoutComponent` disables `submit-order-btn` when `cartService.isEmpty()` is `true`. Playwright waits up to 30s for the disabled button to become enabled and fails.
- **Suggestion**: Add `localStorage` persistence to `CartService` so cart items survive page reloads/direct route navigation, OR update E2E test steps to use SPA client router navigation (open cart drawer -> click proceed to checkout link).

### [Major] Finding 2: Playwright E2E Test Timeout on `TC-EDGE-02` (`e2e/edge-cases.spec.ts:25`)
- **What**: Test `TC-EDGE-02: Should validate required input fields on checkout form` failed with a 30,000ms timeout on `await submitBtn.click()`.
- **Where**: `e2e/edge-cases.spec.ts:40`
- **Why**: `checkoutBtn.isVisible()` evaluates to `false` because the cart drawer was closed. The test falls back to `await page.goto('/checkout')`, which reloads the page, wipes cart signal state, and disables `submit-order-btn`.
- **Suggestion**: Ensure cart state persistence in `CartService` via `localStorage`, or update test to open cart drawer before navigating.

### [Major] Finding 3: Playwright E2E Test Timeout on `TC-EDGE-03` (`e2e/edge-cases.spec.ts:47`)
- **What**: Test `TC-EDGE-03: Should reject invalid email format in checkout form` failed with a 30,000ms timeout on `await submitBtn.click()`.
- **Where**: `e2e/edge-cases.spec.ts:58`
- **Why**: Direct navigation `await page.goto('/checkout')` reloads the page, wiping in-memory cart items and causing `submit-order-btn` to remain disabled.
- **Suggestion**: Ensure cart state persistence in `CartService` via `localStorage`, or use SPA client navigation in test.

---

## Verified Claims

- **Angular Signals state management**: `orderStatus`, `isSubmitting`, `errorMessage`, `orderConfirmation` signals verified in `src/app/features/checkout/state/checkout.store.ts` → **PASS**
- **REST endpoint contract**: `POST /api/orders` with `items`, `customer`, and `totalAmount` payload verified in `src/app/features/checkout/data/http-order.repository.ts` → **PASS**
- **Dark purple neon form styling**: Verified neon cyan `#00e5ff`, purple glow borders `rgba(111,66,193,0.3)`, dark glass inputs `rgba(18,8,38,0.6)` in `src/app/features/checkout/ui/checkout.component.ts` → **PASS**
- **Playwright `data-testid` attributes**: `checkout-form`, `customer-name`, `customer-email`, `customer-address`, `customer-city`, `customer-zip`, `submit-order-btn`, `order-confirmation`, `order-success` all verified in `src/app/features/checkout/ui/checkout.component.ts` → **PASS**
- **Unit Tests (`ng test`)**: `NG_CLI_ANALYTICS=false npx ng test --watch=false` → **PASS** (11 test files, 58 tests passed)
- **Production Build (`npm run build`)**: `NG_CLI_ANALYTICS=false npm run build` → **PASS** (0 errors)
- **Playwright E2E Checkout Tests**: `npx playwright test e2e/checkout.spec.ts` → **FAIL** (2 passed, 1 failed)
- **Playwright E2E Full Test Suite**: `npx playwright test` → **FAIL** (14 passed, 3 failed)

---

## Coverage & Integrity Verification

- **Integrity Violations**: None detected (no hardcoded outputs, facade mocks, or bypassed logic).
- **Architecture**: Modular structure separating domain models, repository pattern, signal store, and standalone UI component.

---

## Conclusion & Recommendation

State management, REST client contracts, and UI styling are correctly built and pass unit tests and production builds. However, due to in-memory cart reset on direct browser route navigations, 3 Playwright E2E tests fail.

**Action Required**:
1. Implement `localStorage` synchronization in `CartService` (`src/app/features/cart/state/cart.service.ts`) so cart state persists across browser page reloads/direct URL navigation (`page.goto('/checkout')`), AND/OR:
2. Ensure E2E tests (`e2e/checkout.spec.ts`, `e2e/edge-cases.spec.ts`) utilize SPA client router links to navigate to `/checkout`.
