# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cart.spec.ts >> Tier 3: Cart Cross-Feature Interactions & State Management >> TC-CART-03: Should update product quantity (increment/decrement) and recalculate total
- Location: e2e/cart.spec.ts:47:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 2
Received: 1
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e4]:
    - navigation [ref=e5]:
      - generic [ref=e6]:
        - link " CloudForge Marketplace" [ref=e7] [cursor=pointer]:
          - /url: /
          - generic [ref=e8]: 
          - generic [ref=e9]: CloudForge Marketplace
        - generic [ref=e10]:
          - list [ref=e11]:
            - listitem [ref=e12]:
              - link "Catálogo" [ref=e13] [cursor=pointer]:
                - /url: /catalog
          - button " Carrito 2" [ref=e15] [cursor=pointer]:
            - generic [ref=e16]: 
            - generic [ref=e17]: Carrito
            - generic [ref=e18]: "2"
  - main [ref=e19]:
    - generic [ref=e21]:
      - generic [ref=e22]:
        - heading " CloudForge Marketplace" [level=1] [ref=e23]:
          - generic [ref=e24]: 
          - text: CloudForge Marketplace
        - paragraph [ref=e25]: Infraestructura cloud de alto rendimiento, microservicios empresariales y soluciones serverless lista para desplegar.
      - generic [ref=e26]:
        - generic [ref=e28]:
          - generic [ref=e29]: 
          - textbox "Buscar productos" [ref=e31]:
            - /placeholder: Buscar productos cloud...
        - generic [ref=e32]:
          - generic [ref=e33]: "Categoría:"
          - combobox [ref=e34]:
            - option "Todas" [selected]
            - option "Infrastructure"
            - option "Databases"
            - option "Messaging"
            - option "Compute"
            - option "Security"
      - generic [ref=e35]:
        - button "Todas" [ref=e36] [cursor=pointer]
        - button "Infrastructure" [ref=e37] [cursor=pointer]
        - button "Databases" [ref=e38] [cursor=pointer]
        - button "Messaging" [ref=e39] [cursor=pointer]
        - button "Compute" [ref=e40] [cursor=pointer]
        - button "Security" [ref=e41] [cursor=pointer]
      - generic [ref=e42]:
        - generic [ref=e44]:
          - generic [ref=e45]:
            - img "Producto de Prueba Cloudforge" [ref=e46]
            - generic [ref=e47]: Infrastructure
          - generic [ref=e48]:
            - heading "Producto de Prueba Cloudforge" [level=5] [ref=e49]
            - paragraph [ref=e50]: Instancia cloud de prueba de alto rendimiento para entornos Cloudforge Marketplace.
            - generic [ref=e51]:
              - generic [ref=e52]: $15,000 CLP
              - generic [ref=e53]: "Stock: 50"
            - button " Agregar" [ref=e54] [cursor=pointer]:
              - generic [ref=e55]: 
              - text: Agregar
        - generic [ref=e57]:
          - generic [ref=e58]:
            - img "Kubernetes Enterprise Cluster" [ref=e59]
            - generic [ref=e60]: Infrastructure
          - generic [ref=e61]:
            - heading "Kubernetes Enterprise Cluster" [level=5] [ref=e62]
            - paragraph [ref=e63]: Cluster administrado k8s con autoscaling de nodos y monitoreo Prometheus integrado.
            - generic [ref=e64]:
              - generic [ref=e65]: $45,000 CLP
              - generic [ref=e66]: "Stock: 20"
            - button " Agregar" [ref=e67] [cursor=pointer]:
              - generic [ref=e68]: 
              - text: Agregar
        - generic [ref=e70]:
          - generic [ref=e71]:
            - img "Cloudforge DB Postgres Managed" [ref=e72]
            - generic [ref=e73]: Databases
          - generic [ref=e74]:
            - heading "Cloudforge DB Postgres Managed" [level=5] [ref=e75]
            - paragraph [ref=e76]: Base de datos PostgreSQL altamente disponible con failover automático y backups continuos.
            - generic [ref=e77]:
              - generic [ref=e78]: $25,000 CLP
              - generic [ref=e79]: "Stock: 15"
            - button " Agregar" [ref=e80] [cursor=pointer]:
              - generic [ref=e81]: 
              - text: Agregar
        - generic [ref=e83]:
          - generic [ref=e84]:
            - img "Serverless Event Mesh" [ref=e85]
            - generic [ref=e86]: Messaging
          - generic [ref=e87]:
            - heading "Serverless Event Mesh" [level=5] [ref=e88]
            - paragraph [ref=e89]: Bus de eventos distribuido de ultra baja latencia para arquitecturas reactivas.
            - generic [ref=e90]:
              - generic [ref=e91]: $12,000 CLP
              - generic [ref=e92]: "Stock: 100"
            - button " Agregar" [ref=e93] [cursor=pointer]:
              - generic [ref=e94]: 
              - text: Agregar
        - generic [ref=e96]:
          - generic [ref=e97]:
            - img "AI Vector Engine GPU" [ref=e98]
            - generic [ref=e99]: Compute
          - generic [ref=e100]:
            - heading "AI Vector Engine GPU" [level=5] [ref=e101]
            - paragraph [ref=e102]: Acelerador de búsqueda vectorial con GPUs NVIDIA H100 para LLMs e IA generativa.
            - generic [ref=e103]:
              - generic [ref=e104]: $85,000 CLP
              - generic [ref=e105]: "Stock: 5"
            - button " Agregar" [ref=e106] [cursor=pointer]:
              - generic [ref=e107]: 
              - text: Agregar
        - generic [ref=e109]:
          - generic [ref=e110]:
            - img "Cloud Security Guard" [ref=e111]
            - generic [ref=e112]: Security
          - generic [ref=e113]:
            - heading "Cloud Security Guard" [level=5] [ref=e114]
            - paragraph [ref=e115]: Servicio de auditoría de seguridad en tiempo real y prevención de amenazas.
            - generic [ref=e116]:
              - generic [ref=e117]: $18,000 CLP
              - generic [ref=e118]: Agotado
            - button " Agotado" [disabled]:
              - generic: 
              - text: Agotado
  - generic [ref=e120]:
    - generic [ref=e121]:
      - heading " Carrito de Compras" [level=5] [ref=e122]:
        - generic [ref=e123]: 
        - generic [ref=e124]: Carrito de Compras
      - button "Cerrar" [ref=e125] [cursor=pointer]
    - generic [ref=e128]:
      - img "Producto de Prueba Cloudforge" [ref=e129]
      - generic [ref=e130]:
        - heading "Producto de Prueba Cloudforge" [level=6] [ref=e131]
        - generic [ref=e132]: $15,000
      - generic [ref=e133]:
        - button "-" [ref=e134] [cursor=pointer]
        - generic [ref=e135]: "2"
        - button "+" [active] [ref=e136] [cursor=pointer]
      - button "" [ref=e137] [cursor=pointer]
    - generic [ref=e139]:
      - generic [ref=e140]:
        - generic [ref=e141]: "Total:"
        - generic [ref=e142]: $30,000
      - button "Ir al Checkout" [ref=e143] [cursor=pointer]
  - contentinfo [ref=e145]:
    - generic [ref=e146]:
      - generic [ref=e147]:
        - generic [ref=e148]: 
        - generic [ref=e149]: CloudForge Marketplace
      - paragraph [ref=e150]: © 2026 CloudForge Inc. Todos los derechos reservados. Impulsado por Angular Signals & NestJS.
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Tier 3: Cart Cross-Feature Interactions & State Management', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/');
  6   |   });
  7   | 
  8   |   test('TC-CART-01: Should toggle cart drawer open and close', async ({ page }) => {
  9   |     const cartToggleBtn = page.locator('[data-testid="cart-toggle-btn"], button:has-text("Carrito"), button:has-text("Cart"), .cart-icon-btn');
  10  |     await expect(cartToggleBtn).toBeVisible();
  11  | 
  12  |     // Open drawer
  13  |     await cartToggleBtn.click();
  14  |     const cartDrawer = page.locator('[data-testid="cart-drawer"], .cart-drawer, .offcanvas, .modal-cart');
  15  |     await expect(cartDrawer).toBeVisible();
  16  | 
  17  |     // Close drawer via close button or backdrop
  18  |     const closeBtn = page.locator('[data-testid="cart-close-btn"], .btn-close, button:has-text("Cerrar"), button:has-text("Close")');
  19  |     if (await closeBtn.isVisible()) {
  20  |       await closeBtn.click();
  21  |     } else {
  22  |       await cartToggleBtn.click();
  23  |     }
  24  |     await expect(cartDrawer).not.toBeVisible();
  25  |   });
  26  | 
  27  |   test('TC-CART-02: Should display added items and compute subtotal correctly in cart drawer', async ({ page }) => {
  28  |     // Add product to cart
  29  |     const addBtn = page.locator('[data-testid="add-to-cart-btn"], button:has-text("Add to Cart"), button:has-text("Agregar")').first();
  30  |     await addBtn.click();
  31  | 
  32  |     // Open cart drawer
  33  |     const cartToggleBtn = page.locator('[data-testid="cart-toggle-btn"], button:has-text("Carrito"), button:has-text("Cart"), .cart-icon-btn');
  34  |     await cartToggleBtn.click();
  35  | 
  36  |     // Verify item is present in cart
  37  |     const cartItem = page.locator('[data-testid="cart-item"], .cart-item').first();
  38  |     await expect(cartItem).toBeVisible();
  39  | 
  40  |     // Total price display check
  41  |     const cartTotal = page.locator('[data-testid="cart-total"], .cart-total, .total-price');
  42  |     await expect(cartTotal).toBeVisible();
  43  |     const totalText = await cartTotal.innerText();
  44  |     expect(totalText).toMatch(/\$?\d+(\.\d{2})?/);
  45  |   });
  46  | 
  47  |   test('TC-CART-03: Should update product quantity (increment/decrement) and recalculate total', async ({ page }) => {
  48  |     // Add product to cart
  49  |     await page.locator('[data-testid="add-to-cart-btn"], button:has-text("Add to Cart"), button:has-text("Agregar")').first().click();
  50  | 
  51  |     // Open cart drawer
  52  |     await page.locator('[data-testid="cart-toggle-btn"], button:has-text("Carrito"), button:has-text("Cart"), .cart-icon-btn').click();
  53  | 
  54  |     const qtyDisplay = page.locator('[data-testid="item-quantity"], .item-quantity, input[name="quantity"]').first();
  55  |     const incBtn = page.locator('[data-testid="qty-increment"], button:has-text("+"), .btn-inc').first();
  56  |     const decBtn = page.locator('[data-testid="qty-decrement"], button:has-text("-"), .btn-dec').first();
  57  | 
  58  |     const initialQty = await qtyDisplay.innerText() || await qtyDisplay.inputValue();
  59  | 
  60  |     // Increment quantity
  61  |     await incBtn.click();
  62  |     const incrementedQty = await qtyDisplay.innerText() || await qtyDisplay.inputValue();
> 63  |     expect(parseInt(incrementedQty, 10)).toBe(parseInt(initialQty, 10) + 1);
      |                                          ^ Error: expect(received).toBe(expected) // Object.is equality
  64  | 
  65  |     // Decrement quantity
  66  |     await decBtn.click();
  67  |     const decrementedQty = await qtyDisplay.innerText() || await qtyDisplay.inputValue();
  68  |     expect(parseInt(decrementedQty, 10)).toBe(parseInt(initialQty, 10));
  69  |   });
  70  | 
  71  |   test('TC-CART-04: Should remove item from cart when remove button is clicked', async ({ page }) => {
  72  |     // Add item to cart
  73  |     await page.locator('[data-testid="add-to-cart-btn"], button:has-text("Add to Cart"), button:has-text("Agregar")').first().click();
  74  | 
  75  |     // Open cart
  76  |     await page.locator('[data-testid="cart-toggle-btn"], button:has-text("Carrito"), button:has-text("Cart"), .cart-icon-btn').click();
  77  | 
  78  |     // Click remove button
  79  |     const removeBtn = page.locator('[data-testid="remove-item-btn"], button:has-text("Eliminar"), button:has-text("Remove"), .btn-remove').first();
  80  |     await removeBtn.click();
  81  | 
  82  |     // Cart item should be removed or empty state visible
  83  |     const cartItems = page.locator('[data-testid="cart-item"], .cart-item');
  84  |     await expect(cartItems).toHaveCount(0);
  85  |   });
  86  | 
  87  |   test('TC-CART-05: Should handle adding multiple distinct products to cart', async ({ page }) => {
  88  |     const addBtns = page.locator('[data-testid="add-to-cart-btn"], button:has-text("Add to Cart"), button:has-text("Agregar")');
  89  |     const count = await addBtns.count();
  90  | 
  91  |     if (count >= 2) {
  92  |       await addBtns.nth(0).click();
  93  |       await addBtns.nth(1).click();
  94  | 
  95  |       await page.locator('[data-testid="cart-toggle-btn"], button:has-text("Carrito"), button:has-text("Cart"), .cart-icon-btn').click();
  96  |       const cartItems = page.locator('[data-testid="cart-item"], .cart-item');
  97  |       await expect(cartItems).toHaveCount(2);
  98  |     }
  99  |   });
  100 | });
  101 | 
```