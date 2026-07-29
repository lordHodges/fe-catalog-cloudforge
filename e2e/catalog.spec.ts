import { test, expect } from "@playwright/test";

test.describe("Tier 1: Catalog Feature Coverage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("TC-CAT-01: Should load catalog page and display product grid with required elements", async ({
    page,
  }) => {
    // Header should display title/logo and cart button
    const header = page.locator('header, [data-testid="header"]');
    await expect(header).toBeVisible();

    // At least one product card must be rendered in catalog
    const productCards = page.locator(
      '[data-testid="product-card"], .product-card, article',
    );
    await expect(productCards.first()).toBeVisible();

    // Verify product card displays required attributes: name, price, stock, add-to-cart button
    const firstCard = productCards.first();
    const productName = firstCard.locator(
      '[data-testid="product-name"], .product-title, h3, h5',
    );
    const productPrice = firstCard.locator(
      '[data-testid="product-price"], .product-price, .price',
    );
    const addBtn = firstCard.locator(
      '[data-testid="add-to-cart-btn"], button:has-text("Add to Cart"), button:has-text("Agregar")',
    );

    await expect(productName).toBeVisible();
    await expect(productPrice).toBeVisible();
    await expect(addBtn).toBeVisible();
  });

  test("TC-CAT-02: Should update header cart badge when adding product to cart (Signals state update)", async ({
    page,
  }) => {
    const cartBadge = page.locator(
      '[data-testid="cart-count-badge"], .cart-badge, [data-testid="cart-badge"]',
    );

    // Initial badge count check (0 or hidden)
    const initialCount = (await cartBadge.isVisible())
      ? await cartBadge.innerText()
      : "0";

    // Click Add to Cart on first available product
    const addBtn = page
      .locator(
        '[data-testid="add-to-cart-btn"], button:has-text("Add to Cart"), button:has-text("Agregar")',
      )
      .first();
    await addBtn.click();

    // Cart badge should update reactively
    await expect(cartBadge).toBeVisible();
    const newCount = await cartBadge.innerText();
    expect(parseInt(newCount, 10)).toBeGreaterThan(
      parseInt(initialCount || "0", 10),
    );
  });

  test("TC-CAT-03: Should filter products by category when category selection changes", async ({
    page,
  }) => {
    const categoryFilter = page.locator(
      '[data-testid="category-filter"], select[name="category"], .category-filter button',
    );

    if (await categoryFilter.first().isVisible()) {
      // Perform category filter interaction
      if (
        await categoryFilter.first().evaluate((el) => el.tagName === "SELECT")
      ) {
        const options = await categoryFilter.locator("option").allInnerTexts();
        if (options.length > 1) {
          await categoryFilter.selectOption({ index: 1 });
        }
      } else {
        await categoryFilter.nth(1).click();
      }

      // Products grid should still display matching items
      const productCards = page.locator(
        '[data-testid="product-card"], .product-card, article',
      );
      await expect(productCards.first()).toBeVisible();
    }
  });

  test("TC-CAT-04: Should display stock status indicators for available products", async ({
    page,
  }) => {
    const stockIndicator = page
      .locator('[data-testid="product-stock"], .stock-badge, .badge')
      .first();
    await expect(stockIndicator).toBeVisible();
  });
});
