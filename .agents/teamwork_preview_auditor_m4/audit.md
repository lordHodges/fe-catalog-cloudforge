# Forensic Audit Report — Milestone M4 (Checkout Vertical Slice & Backend Integration)

**Work Product**: `fe-catalog-cloudforge`
**Target Milestone**: M4 (Checkout Vertical Slice & Backend Integration)
**Profile**: General Project
**Verdict**: VIOLATION

---

## 1. Forensic Integrity Analysis Summary

| Phase / Check | Description | Status | Details |
|---|---|---|---|
| **Phase 1: Hardcoded test results** | Search for embedded expected outputs or fake pass strings in source code | **PASS** | No hardcoded outputs or cheated assertions found in domain, data, state, or UI layers. |
| **Phase 1: Facade implementations** | Search for mock-only interfaces, empty methods, or standard constant return stubs | **PASS** | Clean vertical slice architecture with real reactive Signal store (`CheckoutStore`), domain models (`CustomerInfo`, `CreateOrderPayload`, `OrderConfirmation`), and real HTTP repository (`HttpOrderRepository` using `HttpClient`). |
| **Phase 1: Pre-populated artifacts** | Search for pre-baked test logs or fake result files predating execution | **PASS** | No pre-populated logs or fabricated evidence files found. |
| **Phase 1: Dependency audit** | Check for unauthorized third-party libraries or execution delegation | **PASS** | Standard Angular standalone components, RxJS streams, and Angular Signals used. Core deliverable implemented genuinely. |
| **Phase 2: Unit Test Suite Execution** | Execute `NG_CLI_ANALYTICS=false npx ng test --watch=false` | **PASS** | 11 test files passed, 58 tests passed cleanly in 2.99s. |
| **Phase 2: Production Build** | Execute `NG_CLI_ANALYTICS=false npm run build` | **PASS** | Angular application bundle generated successfully in 12.87s without errors. |
| **Phase 2: Playwright Checkout E2E** | Execute `npx playwright test e2e/checkout.spec.ts` | **FAIL** | 2 passed, 1 failed (`TC-CHK-03` timed out after 30s). |
| **Phase 2: Full Playwright E2E Suite** | Execute `npx playwright test` | **FAIL** | 14 passed, 3 failed (`TC-CHK-03`, `TC-EDGE-02`, `TC-EDGE-03` timed out after 30s). |

---

## 2. Failure Analysis & Root Cause

### Empirical Defect Findings
During behavioral test execution of Playwright E2E tests, 3 test cases failed:
1. `e2e/checkout.spec.ts:127` — `TC-CHK-03: Should clear cart signal state after successful checkout submission`
2. `e2e/edge-cases.spec.ts:25` — `TC-EDGE-02: Should validate required input fields on checkout form`
3. `e2e/edge-cases.spec.ts:47` — `TC-EDGE-03: Should reject invalid email format in checkout form`

### Technical Root Cause
- `CartService` (`src/app/features/cart/state/cart.service.ts`) maintains cart items solely in memory via Angular Signals (`signal<CartItem[]>([])`) without `localStorage` or session persistence.
- In `TC-CHK-03`, `TC-EDGE-02`, and `TC-EDGE-03`, after adding items to cart on `/`, the tests invoke `await page.goto('/checkout')`.
- `page.goto('/checkout')` forces a full browser page refresh. This re-instantiates `CartService`, resetting `cartItems` to an empty array (`[]`).
- In `CheckoutComponent` template (`src/app/features/checkout/ui/checkout.component.ts`: line 182), the submit button is disabled when cart is empty:
  `[disabled]="cartService.isEmpty() || checkoutStore.isSubmitting()"`
- When Playwright executes `await submitBtn.click()`, it waits for the button to become enabled. Because the cart was wiped by page reload, the button remains disabled, causing Playwright to time out after 30,000ms.

---

## 3. Evidence Chain & Test Verification Outputs

### A. Unit Test Execution Output
```
Angular CLI test suite run:
NG_CLI_ANALYTICS=false npx ng test --watch=false

✓ |app| src/app/features/checkout/domain/order.model.spec.ts (2 tests)
✓ |app| src/app/core/cart.service.spec.ts (10 tests)
✓ |app| src/app/features/checkout/data/http-order.repository.spec.ts (1 test)
✓ |app| src/app/features/checkout/state/checkout.store.spec.ts (4 tests)
✓ |app| src/app/features/catalog/state/catalog.store.spec.ts (5 tests)
✓ |app| src/app/features/catalog/data/mock-catalog.repository.spec.ts (5 tests)
✓ |app| src/app/app.spec.ts (2 tests)
✓ |app| src/app/features/cart/ui/cart-drawer.component.spec.ts (10 tests)
✓ |app| src/app/features/checkout/ui/checkout.component.spec.ts (4 tests)
✓ |app| src/app/features/catalog/catalog.component.spec.ts (6 tests)

Test Files  11 passed (11)
     Tests  58 passed (58)
  Duration  2.99s
```

### B. Production Build Output
```
NG_CLI_ANALYTICS=false npm run build

Initial chunk files | Names              |  Raw size | Estimated transfer size
styles-37YDLGMR.css | styles             | 317.36 kB |                33.47 kB
main-ZS56WPGJ.js    | main               | 283.18 kB |                76.66 kB

                    | Initial total      | 600.54 kB |               110.13 kB

Lazy chunk files    | Names              |  Raw size | Estimated transfer size
chunk-2-lpdCDJ.js   | -                  |  41.44 kB |                 9.11 kB
chunk-DqIahwFz.js   | checkout-component |  13.81 kB |                 3.83 kB
chunk-DlXzVacC.js   | catalog-component  |   9.49 kB |                 3.11 kB

Application bundle generation complete. [12.868 seconds]
```

### C. Playwright E2E Test Failures Log
```
npx playwright test

  1) [chromium] › e2e/checkout.spec.ts:127:7 › TC-CHK-03: Should clear cart signal state after successful checkout submission
    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
      - waiting for locator('[data-testid="submit-order-btn"]')
        - element is not enabled (disabled because cartService.isEmpty() is true after page reload)

  2) [chromium] › e2e/edge-cases.spec.ts:25:7 › TC-EDGE-02: Should validate required input fields on checkout form
    Error: locator.click: Test timeout of 30000ms exceeded.

  3) [chromium] › e2e/edge-cases.spec.ts:47:7 › TC-EDGE-03: Should reject invalid email format in checkout form
    Error: locator.click: Test timeout of 30000ms exceeded.

  3 failed (14 passed, 17 total)
```

---

## 4. Required Remediation

To achieve CLEAN verdict:
1. Either update `CartService` (`src/app/features/cart/state/cart.service.ts`) to persist `cartItems` in `localStorage` so page refreshes/direct route navigation do not clear cart state.
2. Or update tests `TC-CHK-03`, `TC-EDGE-02`, and `TC-EDGE-03` to use SPA router navigation (e.g. open cart drawer and click checkout link `a[href="/checkout"]`) rather than `page.goto('/checkout')` direct page reloads.

---

## 5. Final Verdict

**Verdict**: **VIOLATION**
Milestone M4 implementation passes code structural integrity, unit tests, and production build, but FAILS Playwright E2E test execution (3 failing test cases due to in-memory cart state erasure on direct route page reloads).
