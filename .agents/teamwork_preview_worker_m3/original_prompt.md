## 2026-07-28T12:28:56Z
You are the Implementation Worker for Milestone M3 (Cart Vertical Slice Implementation).

Your working directory is: /home/dev-lord/Workspace/Projects/1000_hodges_devel/03_ai_assisted/marketplace/fe-catalog-cloudforge/.agents/teamwork_preview_worker_m3

Context & Inputs:
- Project spec: `/home/dev-lord/Workspace/Projects/1000_hodges_devel/03_ai_assisted/marketplace/fe-catalog-cloudforge/PROJECT.md`
- E2E Test suite specs: `/home/dev-lord/Workspace/Projects/1000_hodges_devel/03_ai_assisted/marketplace/fe-catalog-cloudforge/TEST_READY.md`

Tasks for M3:
1. Implement Cart Vertical Slice under `src/app/features/cart/` (and connect/refine `src/app/core/cart.service.ts`):
   - `domain/cart.model.ts`: `CartItem` interface (`product: Product`, `quantity: number`).
   - `state/cart.service.ts` (or `CartStore`): Signal-based cart state management with:
     - `cartItems`: WritableSignal<CartItem[]>
     - `totalItemsCount`: Computed Signal<number>
     - `totalAmount`: Computed Signal<number>
     - `isCartOpen`: WritableSignal<boolean>
     - `addToCart(product, quantity=1)`: Adds product or increments quantity. **MUST clamp at `product.stock`**.
     - `updateQuantity(productId, quantity)`: Updates quantity. Clamps at `product.stock`, removes item if quantity <= 0.
     - `removeFromCart(productId)`: Removes item from cart.
     - `clearCart()`: Clears all items.
     - `toggleCart()`, `openCart()`, `closeCart()`.
   - `ui/cart-drawer.component.ts` (and HTML/SCSS): Sliding dark neon cart drawer overlay:
     - Container overlay with `data-testid="cart-drawer"` (or `data-testid="cart-offcanvas"`).
     - Drawer header with title, cart item count, and close button (`data-testid="close-cart-btn"`).
     - Empty cart state: renders empty message and disabled checkout button (`data-testid="checkout-btn"`).
     - Item list: product title, price, quantity controls:
       - Decrement button (`data-testid="decrement-qty-btn"` or `data-testid="cart-item-decrement"`)
       - Quantity text (`data-testid="cart-item-qty"`)
       - Increment button (`data-testid="increment-qty-btn"` or `data-testid="cart-item-increment"`, disabled if quantity >= stock)
       - Item remove button (`data-testid="remove-item-btn"` or `data-testid="cart-item-remove"`)
     - Drawer footer: total price (`data-testid="cart-total"` or `data-testid="cart-subtotal"`) and "Proceder al Checkout" button (`data-testid="checkout-btn"`), navigating to `/checkout` when clicked.
2. Integrate `CartDrawerComponent` into `AppComponent` (`src/app/app.html` & `src/app/app.ts`) so clicking navbar cart button (`data-testid="cart-toggle-btn"`) opens the drawer.
3. Write unit tests for `CartService` and `CartDrawerComponent` in `src/app/features/cart/`.
4. Run `ng test --watch=false`, `npm run build`, and `npx playwright test e2e/cart.spec.ts` & `npx playwright test e2e/edge-cases.spec.ts`.
5. Create `.agents/teamwork_preview_worker_m3/progress.md` and `.agents/teamwork_preview_worker_m3/handoff.md`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
