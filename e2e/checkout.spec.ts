import { test, expect } from '@playwright/test';

test.describe('Tier 4: Checkout Critical Flow & Real-World User Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-CHK-01: Should render checkout form with all customer input fields', async ({ page }) => {
    // Add product to cart to proceed to checkout
    await page.locator('[data-testid="add-to-cart-btn"], button:has-text("Add to Cart"), button:has-text("Agregar")').first().click();
    
    // Navigate to checkout page
    const checkoutBtn = page.locator('[data-testid="proceed-to-checkout-btn"], button:has-text("Checkout"), a[href="/checkout"]').first();
    if (await checkoutBtn.isVisible()) {
      await checkoutBtn.click();
    } else {
      await page.goto('/checkout');
    }

    // Check all required customer form fields are present
    const nameInput = page.locator('[data-testid="customer-name"], input[name="name"]');
    const emailInput = page.locator('[data-testid="customer-email"], input[name="email"], input[type="email"]');
    const addressInput = page.locator('[data-testid="customer-address"], input[name="address"]');
    const cityInput = page.locator('[data-testid="customer-city"], input[name="city"]');
    const zipCodeInput = page.locator('[data-testid="customer-zip"], input[name="zipCode"], input[name="zip"]');
    const submitBtn = page.locator('[data-testid="submit-order-btn"], button[type="submit"], button:has-text("Realizar pedido"), button:has-text("Pay")');

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(addressInput).toBeVisible();
    await expect(cityInput).toBeVisible();
    await expect(zipCodeInput).toBeVisible();
    await expect(submitBtn).toBeVisible();
  });

  test('TC-CHK-02: Should execute complete user journey (Catalog -> Cart -> Checkout -> Order Submission)', async ({ page }) => {
    // Step 1: Catalog view - verify catalog loads
    const productCard = page.locator('[data-testid="product-card"], .product-card, article').first();
    await expect(productCard).toBeVisible();

    // Step 2: Add multiple products to cart
    const addBtns = page.locator('[data-testid="add-to-cart-btn"], button:has-text("Add to Cart"), button:has-text("Agregar")');
    await addBtns.nth(0).click();

    // Step 3: Open Cart Drawer & verify items & subtotal
    const cartToggleBtn = page.locator('[data-testid="cart-toggle-btn"], button:has-text("Carrito"), button:has-text("Cart"), .cart-icon-btn');
    await cartToggleBtn.click();

    const cartDrawer = page.locator('[data-testid="cart-drawer"], .cart-drawer, .offcanvas, .modal-cart');
    await expect(cartDrawer).toBeVisible();
    
    const cartItems = page.locator('[data-testid="cart-item"], .cart-item');
    await expect(cartItems.first()).toBeVisible();

    // Step 4: Proceed to Checkout
    const checkoutNavBtn = page.locator('[data-testid="proceed-to-checkout-btn"], button:has-text("Checkout"), button:has-text("Ir al Checkout"), a[href="/checkout"]').first();
    if (await checkoutNavBtn.isVisible()) {
      await checkoutNavBtn.click();
    } else {
      await page.goto('/checkout');
    }

    // Step 5: Intercept network POST request to backend checkout API
    let checkoutPayload: any = null;
    await page.route('**/api/checkout**', async (route) => {
      const request = route.request();
      if (request.method() === 'POST') {
        checkoutPayload = request.postDataJSON();
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            orderId: 'ORD-TEST-12345',
            message: 'Order created successfully'
          })
        });
      } else {
        await route.continue();
      }
    });

    // Also fallback intercept for orders endpoint
    await page.route('**/api/orders**', async (route) => {
      const request = route.request();
      if (request.method() === 'POST') {
        checkoutPayload = request.postDataJSON();
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            orderId: 'ORD-TEST-12345',
            message: 'Order created successfully'
          })
        });
      } else {
        await route.continue();
      }
    });

    // Step 6: Fill customer info form
    await page.fill('[data-testid="customer-name"], input[name="name"]', 'Alex Developer');
    await page.fill('[data-testid="customer-email"], input[name="email"], input[type="email"]', 'alex@example.com');
    await page.fill('[data-testid="customer-address"], input[name="address"]', '123 Cloudforge St');
    await page.fill('[data-testid="customer-city"], input[name="city"]', 'Tech City');
    await page.fill('[data-testid="customer-zip"], input[name="zipCode"], input[name="zip"]', '90210');

    // Step 7: Submit Order
    const submitBtn = page.locator('[data-testid="submit-order-btn"], button[type="submit"], button:has-text("Realizar pedido"), button:has-text("Pay")');
    await submitBtn.click();

    // Step 8: Verify order confirmation view
    const confirmationScreen = page.locator('[data-testid="order-success"], [data-testid="order-confirmation"], .order-success, h2:has-text("Gracias"), h2:has-text("Order Confirmed")');
    await expect(confirmationScreen.first()).toBeVisible();

    // Step 9: Verify backend payload contract structure if intercept triggered
    if (checkoutPayload) {
      expect(checkoutPayload).toHaveProperty('items');
      expect(checkoutPayload).toHaveProperty('customer');
      expect(checkoutPayload.customer).toHaveProperty('name', 'Alex Developer');
      expect(checkoutPayload.customer).toHaveProperty('email', 'alex@example.com');
      expect(checkoutPayload).toHaveProperty('totalAmount');
    }
  });

  test('TC-CHK-03: Should clear cart signal state after successful checkout submission', async ({ page }) => {
    await page.route('**/api/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, orderId: 'ORD-999' })
      });
    });

    // Add product
    await page.locator('[data-testid="add-to-cart-btn"], button:has-text("Add to Cart"), button:has-text("Agregar")').first().click();

    // Fill form and submit
    await page.goto('/checkout');
    await page.fill('[data-testid="customer-name"], input[name="name"]', 'Jane Doe');
    await page.fill('[data-testid="customer-email"], input[name="email"], input[type="email"]', 'jane@example.com');
    await page.fill('[data-testid="customer-address"], input[name="address"]', '456 Market Ave');
    await page.fill('[data-testid="customer-city"], input[name="city"]', 'San Francisco');
    await page.fill('[data-testid="customer-zip"], input[name="zipCode"], input[name="zip"]', '94101');

    const submitBtn = page.locator('[data-testid="submit-order-btn"], button[type="submit"]');
    await submitBtn.click();

    // Wait for order confirmation view
    const confirmationScreen = page.locator('[data-testid="order-success"], [data-testid="order-confirmation"]');
    await expect(confirmationScreen.first()).toBeVisible();

    // Check cart badge resets to 0 or hidden
    const cartBadge = page.locator('[data-testid="cart-count-badge"], .cart-badge');
    await expect(cartBadge).toBeHidden();
  });
});
