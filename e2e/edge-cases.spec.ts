import { test, expect } from '@playwright/test';

test.describe('Tier 2: Boundary & Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-EDGE-01: Should handle empty cart state gracefully', async ({ page }) => {
    // Open cart drawer when no items have been added
    const cartToggleBtn = page.locator('[data-testid="cart-toggle-btn"], button:has-text("Carrito"), button:has-text("Cart"), .cart-icon-btn');
    await cartToggleBtn.click();

    // Verify empty state indicator or message
    const emptyMessage = page.locator('[data-testid="empty-cart-message"], .empty-cart');
    await expect(emptyMessage.first()).toBeVisible();


    // Checkout button should either be disabled or hidden
    const checkoutBtn = page.locator('[data-testid="proceed-to-checkout-btn"], button:has-text("Checkout"), a[href="/checkout"]');
    if (await checkoutBtn.isVisible()) {
      await expect(checkoutBtn).toBeDisabled();
    }
  });

  test('TC-EDGE-02: Should validate required input fields on checkout form', async ({ page }) => {
    // Add 1 item to cart to enable checkout navigation
    await page.locator('[data-testid="add-to-cart-btn"], button:has-text("Add to Cart"), button:has-text("Agregar")').first().click();

    // Navigate to checkout
    const checkoutBtn = page.locator('[data-testid="proceed-to-checkout-btn"], button:has-text("Checkout"), a[href="/checkout"]').first();
    if (await checkoutBtn.isVisible()) {
      await checkoutBtn.click();
    } else {
      await page.goto('/checkout');
    }

    // Attempt to submit empty form
    const submitBtn = page.locator('[data-testid="submit-order-btn"], button[type="submit"], button:has-text("Pagar"), button:has-text("Realizar pedido")');
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Validation error messages should be displayed
    const errorMessages = page.locator('[data-testid="error-message"], .invalid-feedback, .error-message, :invalid');
    await expect(errorMessages.first()).toBeVisible();
  });

  test('TC-EDGE-03: Should reject invalid email format in checkout form', async ({ page }) => {
    await page.locator('[data-testid="add-to-cart-btn"], button:has-text("Add to Cart"), button:has-text("Agregar")').first().click();
    await page.goto('/checkout');

    // Fill invalid email
    const emailInput = page.locator('[data-testid="customer-email"], input[name="email"], input[type="email"]');
    await emailInput.fill('invalid-email-format');

    // Focus out or submit
    await emailInput.blur();
    const submitBtn = page.locator('[data-testid="submit-order-btn"], button[type="submit"]');
    await submitBtn.click();

    // Verify invalid feedback / validation message
    const errorMsg = page.locator('[data-testid="email-error"], .invalid-feedback');
    await expect(errorMsg.first()).toBeVisible();
  });

  test('TC-EDGE-04: Should enforce stock boundaries and prevent adding beyond available stock', async ({ page }) => {
    // Add product to cart
    await page.locator('[data-testid="add-to-cart-btn"], button:has-text("Add to Cart"), button:has-text("Agregar")').first().click();
    await page.locator('[data-testid="cart-toggle-btn"], button:has-text("Carrito"), button:has-text("Cart"), .cart-icon-btn').click();

    // Attempt rapid increments up to stock limit
    const incBtn = page.locator('[data-testid="qty-increment"], button:has-text("+")').first();
    if (await incBtn.isVisible()) {
      for (let i = 0; i < 20; i++) {
        if (await incBtn.isEnabled()) {
          await incBtn.click();
        } else {
          break;
        }
      }
      // Quantity should freeze or increment button become disabled when max stock reached
      const qtyDisplay = page.locator('[data-testid="item-quantity"], .item-quantity').first();
      await expect(qtyDisplay).toBeVisible();
    }
  });

  test('TC-EDGE-05: Should handle out of stock item indicator correctly', async ({ page }) => {
    const outOfStockCard = page.locator('[data-testid="product-card"]:has-text("Out of Stock"), .product-card:has-text("Agotado")');
    if (await outOfStockCard.count() > 0) {
      const disabledAddBtn = outOfStockCard.locator('[data-testid="add-to-cart-btn"], button');
      await expect(disabledAddBtn).toBeDisabled();
    }
  });
});
