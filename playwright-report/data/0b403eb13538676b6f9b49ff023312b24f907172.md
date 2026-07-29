# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: adversarial-tier5.spec.ts >> Tier 5: Adversarial Edge Cases & System Hardening >> TC-ADV-E2E-05: Rapid cart quantity increment clamping at maximum product stock
- Location: e2e/adversarial-tier5.spec.ts:142:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "5"
Received: "11"
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
          - button " Carrito 11" [ref=e15] [cursor=pointer]:
            - generic [ref=e16]: 
            - generic [ref=e17]: Carrito
            - generic [ref=e18]: "11"
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
        - generic [ref=e135]: "11"
        - button "+" [active] [ref=e136] [cursor=pointer]
      - button "" [ref=e137] [cursor=pointer]
    - generic [ref=e139]:
      - generic [ref=e140]:
        - generic [ref=e141]: "Total:"
        - generic [ref=e142]: $165,000
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
  65  |     await page.route('**/api/orders**', errorHandler);
  66  |     await page.route('**/api/checkout**', errorHandler);
  67  | 
  68  |     await page.fill('[data-testid="customer-name"]', 'Error User');
  69  |     await page.fill('[data-testid="customer-email"]', 'error@example.com');
  70  |     await page.fill('[data-testid="customer-address"]', '500 Fail St');
  71  |     await page.fill('[data-testid="customer-city"]', 'ErrorCity');
  72  |     await page.fill('[data-testid="customer-zip"]', '00000');
  73  | 
  74  |     const submitBtn = page.locator('[data-testid="submit-order-btn"]');
  75  |     await submitBtn.click();
  76  | 
  77  |     // Verify danger alert appears with message
  78  |     const alertBox = page.locator('.alert-danger, [data-testid="error-message"]');
  79  |     await expect(alertBox.first()).toBeVisible();
  80  |     await expect(alertBox.first()).toContainText('Pasarela de pago no disponible');
  81  | 
  82  |     // Button should become enabled again for retry
  83  |     await expect(submitBtn).toBeEnabled();
  84  |   });
  85  | 
  86  |   test('TC-ADV-E2E-03: Direct checkout access with empty cart prevents submission', async ({ page }) => {
  87  |     await page.goto('/checkout');
  88  | 
  89  |     await page.fill('[data-testid="customer-name"]', 'Empty Cart User');
  90  |     await page.fill('[data-testid="customer-email"]', 'empty@example.com');
  91  |     await page.fill('[data-testid="customer-address"]', '123 Empty Rd');
  92  |     await page.fill('[data-testid="customer-city"]', 'NullCity');
  93  |     await page.fill('[data-testid="customer-zip"]', '12345');
  94  | 
  95  |     let requestFired = false;
  96  |     await page.route('**/api/**', async (route) => {
  97  |       requestFired = true;
  98  |       await route.fulfill({ status: 200, body: '{}' });
  99  |     });
  100 | 
  101 |     const submitBtn = page.locator('[data-testid="submit-order-btn"]');
  102 |     await submitBtn.click();
  103 | 
  104 |     // Form submission should be prevented when cart is empty
  105 |     expect(requestFired).toBe(false);
  106 |     await expect(page.locator('[data-testid="order-confirmation"]')).not.toBeVisible();
  107 |   });
  108 | 
  109 |   test('TC-ADV-E2E-04: Adversarial input injection (XSS & Script Tags in form)', async ({ page }) => {
  110 |     await page.locator('[data-testid="add-to-cart-btn"], button:has-text("Agregar")').first().click();
  111 |     await page.goto('/checkout');
  112 | 
  113 |     const mockSuccess = async (route: any) => {
  114 |       await route.fulfill({
  115 |         status: 200,
  116 |         contentType: 'application/json',
  117 |         body: JSON.stringify({
  118 |           orderId: 'ORD-SAFE-999',
  119 |           status: 'created',
  120 |           totalAmount: 15000
  121 |         })
  122 |       });
  123 |     };
  124 | 
  125 |     await page.route('**/api/orders**', mockSuccess);
  126 |     await page.route('**/api/checkout**', mockSuccess);
  127 | 
  128 |     const xssPayload = '<script>alert("XSS")</script><img src=x onerror=alert(1)>';
  129 |     await page.fill('[data-testid="customer-name"]', xssPayload);
  130 |     await page.fill('[data-testid="customer-email"]', 'xss@example.com');
  131 |     await page.fill('[data-testid="customer-address"]', xssPayload);
  132 |     await page.fill('[data-testid="customer-city"]', 'SafeCity');
  133 |     await page.fill('[data-testid="customer-zip"]', '90210');
  134 | 
  135 |     await page.locator('[data-testid="submit-order-btn"]').click();
  136 | 
  137 |     // Order confirmation should render safely
  138 |     await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible();
  139 |     await expect(page.locator('[data-testid="order-success"]')).toBeVisible();
  140 |   });
  141 | 
  142 |   test('TC-ADV-E2E-05: Rapid cart quantity increment clamping at maximum product stock', async ({ page }) => {
  143 |     // Select product with stock = 5 ("AI Vector Engine GPU")
  144 |     const cardWithStock5 = page.locator('[data-testid="product-card"]:has-text("Stock: 5")');
  145 |     const addBtn = cardWithStock5.locator('[data-testid="add-to-cart-btn"]');
  146 |     await addBtn.first().click();
  147 | 
  148 |     // Open cart drawer
  149 |     await page.locator('[data-testid="cart-toggle-btn"]').click();
  150 | 
  151 |     const incBtn = page.locator('[data-testid="qty-increment"]').first();
  152 |     await expect(incBtn).toBeVisible();
  153 | 
  154 |     // Click increment repeatedly up to stock 5
  155 |     for (let i = 0; i < 10; i++) {
  156 |       if (await incBtn.isEnabled()) {
  157 |         await incBtn.click();
  158 |       } else {
  159 |         break;
  160 |       }
  161 |     }
  162 | 
  163 |     // Quantity should be clamped at 5 and increment button disabled
  164 |     const qtyText = await page.locator('[data-testid="item-quantity"]').first().innerText();
> 165 |     expect(qtyText.trim()).toBe('5');
      |                            ^ Error: expect(received).toBe(expected) // Object.is equality
  166 |     await expect(incBtn).toBeDisabled();
  167 |   });
  168 | });
  169 | 
```