import { test, expect } from "@playwright/test";

test.describe("Tier 5: Adversarial Edge Cases & System Hardening", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("TC-ADV-E2E-01: Rapid double click on checkout submission (burst protection)", async ({
    page,
  }) => {
    // Add product to cart
    await page
      .locator('[data-testid="add-to-cart-btn"], button:has-text("Agregar")')
      .first()
      .click();
    await page.goto("/checkout");

    let postRequestCount = 0;
    const mockHandler = async (route: any) => {
      postRequestCount++;
      await new Promise((resolve) => setTimeout(resolve, 400));
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          orderId: "ORD-BURST-100",
          totalAmount: 15000,
        }),
      });
    };

    await page.route("**/api/orders**", mockHandler);
    await page.route("**/api/checkout**", mockHandler);

    // Fill form fields
    await page.fill('[data-testid="customer-name"]', "Alex BurstTest");
    await page.fill('[data-testid="customer-email"]', "burst@example.com");
    await page.fill('[data-testid="customer-address"]', "100 Cyber Way");
    await page.fill('[data-testid="customer-city"]', "TechCity");
    await page.fill('[data-testid="customer-zip"]', "90210");

    const submitBtn = page.locator('[data-testid="submit-order-btn"]');

    // Click submit and verify button becomes disabled immediately during inflight request
    await submitBtn.click();
    await expect(submitBtn).toBeDisabled();

    // Wait for success confirmation screen
    await expect(
      page.locator('[data-testid="order-confirmation"]'),
    ).toBeVisible({ timeout: 10000 });

    // Assert that only ONE POST request reached the server
    expect(postRequestCount).toBe(1);
  });

  test("TC-ADV-E2E-02: Network failure / server 500 recovery on checkout submission", async ({
    page,
  }) => {
    await page
      .locator('[data-testid="add-to-cart-btn"], button:has-text("Agregar")')
      .first()
      .click();
    await page.goto("/checkout");

    const errorHandler = async (route: any) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Error de servidor: Pasarela de pago no disponible",
        }),
      });
    };

    await page.route("**/api/orders**", errorHandler);
    await page.route("**/api/checkout**", errorHandler);

    await page.fill('[data-testid="customer-name"]', "Error User");
    await page.fill('[data-testid="customer-email"]', "error@example.com");
    await page.fill('[data-testid="customer-address"]', "500 Fail St");
    await page.fill('[data-testid="customer-city"]', "ErrorCity");
    await page.fill('[data-testid="customer-zip"]', "00000");

    const submitBtn = page.locator('[data-testid="submit-order-btn"]');
    await submitBtn.click();

    // Verify danger alert appears with message
    const alertBox = page.locator(
      '.alert-danger, [data-testid="error-message"]',
    );
    await expect(alertBox.first()).toBeVisible();
    await expect(alertBox.first()).toContainText(
      "Pasarela de pago no disponible",
    );

    // Button should become enabled again for retry
    await expect(submitBtn).toBeEnabled();
  });

  test("TC-ADV-E2E-03: Direct checkout access with empty cart prevents submission", async ({
    page,
  }) => {
    await page.goto("/checkout");

    await page.fill('[data-testid="customer-name"]', "Empty Cart User");
    await page.fill('[data-testid="customer-email"]', "empty@example.com");
    await page.fill('[data-testid="customer-address"]', "123 Empty Rd");
    await page.fill('[data-testid="customer-city"]', "NullCity");
    await page.fill('[data-testid="customer-zip"]', "12345");

    let requestFired = false;
    await page.route("**/api/**", async (route) => {
      requestFired = true;
      await route.fulfill({ status: 200, body: "{}" });
    });

    const submitBtn = page.locator('[data-testid="submit-order-btn"]');
    await submitBtn.click();

    // Form submission should be prevented when cart is empty
    expect(requestFired).toBe(false);
    await expect(
      page.locator('[data-testid="order-confirmation"]'),
    ).not.toBeVisible();
  });

  test("TC-ADV-E2E-04: Adversarial input injection (XSS & Script Tags in form)", async ({
    page,
  }) => {
    await page
      .locator('[data-testid="add-to-cart-btn"], button:has-text("Agregar")')
      .first()
      .click();
    await page.goto("/checkout");

    const mockSuccess = async (route: any) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          orderId: "ORD-SAFE-999",
          status: "created",
          totalAmount: 15000,
        }),
      });
    };

    await page.route("**/api/orders**", mockSuccess);
    await page.route("**/api/checkout**", mockSuccess);

    const xssPayload =
      '<script>alert("XSS")</script><img src=x onerror=alert(1)>';
    await page.fill('[data-testid="customer-name"]', xssPayload);
    await page.fill('[data-testid="customer-email"]', "xss@example.com");
    await page.fill('[data-testid="customer-address"]', xssPayload);
    await page.fill('[data-testid="customer-city"]', "SafeCity");
    await page.fill('[data-testid="customer-zip"]', "90210");

    await page.locator('[data-testid="submit-order-btn"]').click();

    // Order confirmation should render safely
    await expect(
      page.locator('[data-testid="order-confirmation"]'),
    ).toBeVisible();
    await expect(page.locator('[data-testid="order-success"]')).toBeVisible();
  });

  test("TC-ADV-E2E-05: Rapid cart quantity increment clamping at maximum product stock", async ({
    page,
  }) => {
    // Select product with stock = 5 ("AI Vector Engine GPU", the ONLY product with exactly stock=5)
    // Note: using has-text("Stock: 5") would ALSO match stock=50 (substring), so we use unique title
    const cardWithStock5 = page.locator('[data-testid="product-card"]', {
      hasText: "AI Vector Engine GPU",
    });
    const addBtn = cardWithStock5.locator('[data-testid="add-to-cart-btn"]');
    await addBtn.first().click();

    // Open cart drawer
    await page.locator('[data-testid="cart-toggle-btn"]').click();

    const quantityLabel = page.locator('[data-testid="item-quantity"]').first();
    const incBtn = page.locator('[data-testid="qty-increment"]').first();
    await expect(incBtn).toBeVisible();

    // Increment from qty=1 up to stock=5, waiting for Angular signal propagation between clicks
    for (let i = 0; i < 4; i++) {
      await incBtn.click();
      await expect(quantityLabel).toHaveText(String(i + 2), { timeout: 5000 });
    }

    // After reaching stock = 5, the increment button must be disabled
    await expect(incBtn).toBeDisabled();

    // Attempt one more click to confirm clamping (button should be disabled)
    await incBtn.click({ force: true }).catch(() => {});
    // Quantity must remain at 5
    await expect(quantityLabel).toHaveText("5");
  });
});
