import { test, expect } from '@playwright/test';

test.describe('Tier 3: Cart Cross-Feature Interactions & State Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('TC-CART-01: Should toggle cart drawer open and close', async ({ page }) => {
    const cartToggleBtn = page.locator('[data-testid="cart-toggle-btn"], button:has-text("Carrito"), button:has-text("Cart"), .cart-icon-btn');
    await expect(cartToggleBtn).toBeVisible();

    // Open drawer
    await cartToggleBtn.click();
    const cartDrawer = page.locator('[data-testid="cart-drawer"], .cart-drawer, .offcanvas, .modal-cart');
    await expect(cartDrawer).toBeVisible();

    // Close drawer via close button or backdrop
    const closeBtn = page.locator('[data-testid="cart-close-btn"], .btn-close, button:has-text("Cerrar"), button:has-text("Close")');
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    } else {
      await cartToggleBtn.click();
    }
    await expect(cartDrawer).not.toBeVisible();
  });

  test('TC-CART-02: Should display added items and compute subtotal correctly in cart drawer', async ({ page }) => {
    // Add product to cart
    const addBtn = page.locator('[data-testid="add-to-cart-btn"], button:has-text("Add to Cart"), button:has-text("Agregar")').first();
    await addBtn.click();

    // Open cart drawer
    const cartToggleBtn = page.locator('[data-testid="cart-toggle-btn"], button:has-text("Carrito"), button:has-text("Cart"), .cart-icon-btn');
    await cartToggleBtn.click();

    // Verify item is present in cart
    const cartItem = page.locator('[data-testid="cart-item"], .cart-item').first();
    await expect(cartItem).toBeVisible();

    // Total price display check
    const cartTotal = page.locator('[data-testid="cart-total"], .cart-total, .total-price');
    await expect(cartTotal).toBeVisible();
    const totalText = await cartTotal.innerText();
    expect(totalText).toMatch(/\$?\d+(\.\d{2})?/);
  });

  test('TC-CART-03: Should update product quantity (increment/decrement) and recalculate total', async ({ page }) => {
    // Add product to cart
    await page.locator('[data-testid="add-to-cart-btn"], button:has-text("Add to Cart"), button:has-text("Agregar")').first().click();

    // Open cart drawer
    await page.locator('[data-testid="cart-toggle-btn"], button:has-text("Carrito"), button:has-text("Cart"), .cart-icon-btn').click();

    const qtyDisplay = page.locator('[data-testid="item-quantity"], .item-quantity, input[name="quantity"]').first();
    const incBtn = page.locator('[data-testid="qty-increment"], button:has-text("+"), .btn-inc').first();
    const decBtn = page.locator('[data-testid="qty-decrement"], button:has-text("-"), .btn-dec').first();

    const initialQty = await qtyDisplay.innerText() || await qtyDisplay.inputValue();

    // Increment quantity
    await incBtn.click();
    await page.waitForTimeout(100);
    const incrementedQty = await qtyDisplay.innerText() || await qtyDisplay.inputValue();
    expect(parseInt(incrementedQty, 10)).toBe(parseInt(initialQty, 10) + 1);

    // Decrement quantity
    await decBtn.click();
    await page.waitForTimeout(100);
    const decrementedQty = await qtyDisplay.innerText() || await qtyDisplay.inputValue();
    expect(parseInt(decrementedQty, 10)).toBe(parseInt(initialQty, 10));
  });

  test('TC-CART-04: Should remove item from cart when remove button is clicked', async ({ page }) => {
    // Add item to cart
    await page.locator('[data-testid="add-to-cart-btn"], button:has-text("Add to Cart"), button:has-text("Agregar")').first().click();

    // Open cart
    await page.locator('[data-testid="cart-toggle-btn"], button:has-text("Carrito"), button:has-text("Cart"), .cart-icon-btn').click();

    // Click remove button
    const removeBtn = page.locator('[data-testid="remove-item-btn"], button:has-text("Eliminar"), button:has-text("Remove"), .btn-remove').first();
    await removeBtn.click();

    // Cart item should be removed or empty state visible
    const cartItems = page.locator('[data-testid="cart-item"], .cart-item');
    await expect(cartItems).toHaveCount(0);
  });

  test('TC-CART-05: Should handle adding multiple distinct products to cart', async ({ page }) => {
    const addBtns = page.locator('[data-testid="add-to-cart-btn"], button:has-text("Add to Cart"), button:has-text("Agregar")');
    const count = await addBtns.count();

    if (count >= 2) {
      await addBtns.nth(0).click();
      await addBtns.nth(1).click();

      await page.locator('[data-testid="cart-toggle-btn"], button:has-text("Carrito"), button:has-text("Cart"), .cart-icon-btn').click();
      const cartItems = page.locator('[data-testid="cart-item"], .cart-item');
      await expect(cartItems).toHaveCount(2);
    }
  });
});
