# Milestone M0: Reference & API Codebase Exploration Analysis Report

**Date**: 2026-07-28
**Author**: Explorer Agent (Milestone M0)
**Target Project**: `fe-catalog-cloudforge`
**Reference Projects**: `fe-cloudforge` (Frontend), `be-cloudforge` (Backend)

---

## 1. Executive Summary

This report delivers a thorough analysis of the reference repositories `fe-cloudforge` and `be-cloudforge`, along with an audit of the target workspace `fe-catalog-cloudforge`. 

The objective of Milestone M0 is to establish clear, unambiguous data models, API payload schemas, CORS handling criteria, and architectural guidelines to inform subsequent development milestones (M1–M6) and E2E test suite creation.

---

## 2. Frontend Reference Analysis (`fe-cloudforge`)

### 2.1 Project Architecture & Stack
- **Framework**: Angular v22.0.0 using Standalone Components, SSR (`@angular/ssr`), and Express server wrapper (`express` v5.1.0).
- **Styling**: Tailwind CSS v4.3.1.
- **Routing**: `app.routes.ts` routing between landing pages, checkout, thank-you (`/gracias`), and failed-payment (`/pago-fallido`) pages.
- **State Management**: Signals (`signal`, `viewChildren`) and RxJS for HTTP communications.

### 2.2 Product Data Model
In `fe-cloudforge` (e.g. `LandingProductoA` schema and Firestore structure), products adhere to the following schema:

```typescript
export interface Product {
  id: string;          // e.g. "prod-test-01" or "prod-e2e-123"
  name: string;        // e.g. "Audífonos Sonic Singularity HiFi"
  description: string; // Product description
  price: number;       // Price in CLP (e.g. 49990 or 15000)
  category: string;    // Category name
  imageUrl: string;    // Image URL (e.g. "https://cloudforge-market-9dbcf.web.app/assets/hero.webp")
  stock: number;       // Quantity available in inventory
}
```

### 2.3 Cart Data Models
Cart items combine product references with selected quantities:

```typescript
export interface CartItem {
  product: Product;
  quantity: number;
}
```

When sent to the checkout endpoint, items are mapped into simplified payload items:

```typescript
export interface CheckoutItem {
  id: string;        // Unique product identifier in database
  quantity: number;  // Number of units requested (must be > 0)
}
```

### 2.4 Checkout Data Models & Service Contract
`PaymentService` in `src/app/core/services/payment.service.ts` defines the contract for communicating with the backend:

```typescript
export interface ChileanAddress {
  street_name: string;
  street_number: string;
  department?: string;
  comuna: string;
  region: string;
}

export interface CheckoutPayer {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: ChileanAddress;
}

export interface CreateCheckoutPayload {
  items: CheckoutItem[];
  payer: CheckoutPayer;
}

export interface CheckoutResponse {
  init_point: string;  // External checkout gateway URL (MercadoPago)
  order_id: string;    // Unique UUID generated for the order
}
```

---

## 3. Backend Reference Analysis (`be-cloudforge`)

### 3.1 Stack & Architecture
- **Framework**: NestJS (v11.x) packaged into Serverless Cloud Functions (`processCheckout`).
- **Database**: Cloud Firestore (`@google-cloud/firestore`).
- **Validation**: `class-validator` and `class-transformer`.
- **Integrations**: MercadoPago SDK (`mercadopago`), Dropi.cl API, Resend Email API.

### 3.2 Endpoint Specifications
- **Function Name**: `checkoutSession` / `processCheckout`
- **HTTP Method**: `POST` (Preflight: `OPTIONS`)
- **Local URL**: `http://localhost:5001/cloudforge-market-9dbcf/us-central1/checkoutSession`
- **Production URL**: `https://us-central1-cloudforge-market-9dbcf.cloudfunctions.net/checkoutSession`
- **Headers**:
  - `Content-Type: application/json`
  - `Origin: <request-origin>`

### 3.3 Request Payload DTO (`CreateCheckoutDto`)

```typescript
// CreateCheckoutDto validation rules:
// - items: Non-empty array of CheckoutItemDto
// - payer: Non-empty CheckoutPayerDto

export class CheckoutItemDto {
  id: string;        // @IsString(), @IsNotEmpty()
  quantity: number;  // @IsNumber(), @IsPositive()
}

export class ChileanAddressDto {
  street_name: string;   // @IsString(), @IsNotEmpty()
  street_number: string; // @IsString(), @IsNotEmpty()
  department?: string;   // @IsString(), @IsOptional()
  comuna: string;        // @IsString(), @IsNotEmpty()
  region: string;        // @IsString(), @IsNotEmpty()
}

export class CheckoutPayerDto {
  email: string;             // @IsEmail(), @IsNotEmpty()
  first_name: string;        // @IsString(), @IsNotEmpty()
  last_name: string;         // @IsString(), @IsNotEmpty()
  phone: string;             // @IsString(), @IsNotEmpty()
  address: ChileanAddressDto;// @ValidateNested(), @Type(() => ChileanAddressDto)
}
```

### 3.4 Validation & Business Logic Pipeline
1. **CORS Check**: Evaluated by `validateCors(req, res, isDev)`.
   - Allowed in Production: Domain matching `/^https?:\/\/(?:[a-z0-9-]+\.)*cloudforge\.cl$/`.
   - Allowed in Development (`NODE_ENV === 'development'`): `http://localhost*`, `http://127.0.0.1*`, `http://[::1]*`.
   - Allows non-browser requests without `Origin` header.
   - Preflight (`OPTIONS`): returns HTTP `200 OK`.
   - Invalid Origin: returns HTTP `403 Forbidden` (`{ statusCode: 403, message: "CORS Policy violation: Origin not allowed." }`).
2. **DTO Validation**: Validated using `plainToInstance` + `validate(dto)`.
   - Returns HTTP `400 Bad Request` if invalid:
     ```json
     {
       "statusCode": 400,
       "message": "Validation failed",
       "errors": [
         {
           "property": "payer.email",
           "constraints": { "isEmail": "email must be an email" }
         }
       ]
     }
     ```
3. **Database & Business Rules Validation**:
   - Queries Firestore document `products/{id}`.
   - If product does not exist: throws `BadRequestException` (`HTTP 400`: `El producto con ID {id} no existe en nuestro catálogo.`).
   - If `product.stock < quantity`: throws `BadRequestException` (`HTTP 400`: `Stock insuficiente para el producto "{title}". Stock disponible: {stock}`).
4. **Atomic Transaction**:
   - Decrements stock in `products/{id}`.
   - Creates order record in `orders/{order_id}` with status `'pending_payment'`.
5. **MercadoPago Preference Generation**:
   - Returns HTTP `201 Created`:
     ```json
     {
       "init_point": "https://www.mercadopago.cl/checkout/v1/redirect?pref_id=...",
       "order_id": "c1f70592-3c22-4a57-b08a-4db3224b8109"
     }
     ```

### 3.5 Database Seeding & Testing Utilities
- Seed script (`be-cloudforge/scripts/seed-product.js`):
  - Injects test product: `id = "prod-test-01"`, `title = "Producto de Prueba Cloudforge"`, `price = 15000`, `stock = 50`.
- Firestore Emulator:
  - Host/Port: `127.0.0.1:8080` (configured in `firebase.json`).
  - Clear DB endpoint: `DELETE http://127.0.0.1:8080/emulator/v1/projects/{projectId}/databases/(default)/documents`.

---

## 4. Target Workspace Analysis (`fe-catalog-cloudforge`)

### 4.1 Current State Audit
- **Files Present**:
  - `ORIGINAL_REQUEST.md`: Defines project objectives, acceptance criteria, and technical constraints.
  - `PROJECT.md`: Specifies architecture (Angular Standalone, Signals, Clean Architecture + Vertical Slices, Dark Purple/Neon styling with Bootstrap + Material 3, Playwright E2E suite).
  - `.agents/`: Agent metadata workspace directory.
  - `node_modules/`: Contains `@playwright/test` pre-installed.
- **Status**: The workspace does not yet contain source code, Angular CLI configuration (`angular.json`), `package.json` for Angular, or component feature slices.

### 4.2 Architecture Plan for `fe-catalog-cloudforge`
```
src/
├── app/
│   ├── core/                  # HTTP interceptors, global error handling, base models
│   ├── shared/                # Bootstrap & Neon UI reusable components, pipes, directives
│   ├── features/
│   │   ├── catalog/           # Catalog Vertical Slice (domain model, product mock repo, catalog UI)
│   │   ├── cart/              # Cart Vertical Slice (domain model, Signals cart store, cart drawer UI)
│   │   └── checkout/          # Checkout Vertical Slice (domain model, payment API client, checkout form UI)
│   ├── app.component.ts       # Main layout & navigation header
│   ├── app.config.ts          # Application providers (HttpClient, Router, etc.)
│   └── app.routes.ts          # App routes (/catalog, /cart, /checkout, /gracias)
└── styles.scss                # Global dark purple / neon theme & Bootstrap overrides
```

---

## 5. Specification Matrix for Downstream Teams

| Component | Target Contract | Downstream Action |
|-----------|-----------------|-------------------|
| **Product Model** | `{ id, name, description, price, category, imageUrl, stock }` | Implementer (M2): Create mock catalog repo seeding `prod-test-01` and additional catalog items matching this interface. |
| **Cart Store** | Signals-based Writable / Computed store (`items`, `totalCount`, `totalAmount`) | Implementer (M3): Build custom Signal store managing cart state, reactive updates, and drawer/modal. |
| **Checkout DTO** | `{ items: [{ id, quantity }], payer: { email, first_name, last_name, phone, address: { street_name, street_number, department?, comuna, region } } }` | Implementer (M4): Build checkout form with validation matching backend DTO criteria. |
| **Checkout Endpoint** | `POST http://localhost:5001/cloudforge-market-9dbcf/us-central1/checkoutSession` | Implementer (M4): Create `CheckoutService` connecting to local/prod backend endpoint. |
| **E2E Testing** | Playwright E2E test suite covering Catalog -> Add to Cart -> Checkout Flow | Tester Agent (E2E): Create Playwright tests targeting the full user purchase journey. |
