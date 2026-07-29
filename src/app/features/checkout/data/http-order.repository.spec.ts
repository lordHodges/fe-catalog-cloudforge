import { TestBed } from "@angular/core/testing";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { HttpOrderRepository } from "./http-order.repository";
import { CreateOrderPayload, OrderConfirmation } from "../domain/order.model";

describe("HttpOrderRepository", () => {
  let repository: HttpOrderRepository;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HttpOrderRepository,
      ],
    });

    repository = TestBed.inject(HttpOrderRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should resolve localhost API endpoint in development environment", () => {
    expect(repository.getApiUrl()).toBe("/api/orders");
  });

  it("should resolve Cloud Functions endpoint in production environment", () => {
    vi.spyOn(window, "location", "get").mockReturnValue({
      hostname: "cloudforge-market-9dbcf.web.app",
    } as Location);

    expect(repository.getApiUrl()).toBe(
      "https://us-central1-cloudforge-market-9dbcf.cloudfunctions.net/checkoutSession",
    );

    vi.restoreAllMocks();
  });

  it("should post order payload to /api/orders and map response correctly", () => {
    const payload: CreateOrderPayload = {
      customer: {
        name: "Jane Doe",
        email: "jane@example.com",
        address: "456 Market Ave",
        city: "San Francisco",
        zipCode: "94101",
      },
      items: [{ productId: "p1", quantity: 1, price: 99.99 }],
      totalAmount: 99.99,
    };

    const mockResponse = {
      success: true,
      orderId: "ORD-999",
      message: "Order created successfully",
    };

    let result: OrderConfirmation | undefined;
    repository.createOrder(payload).subscribe((res) => {
      result = res;
    });

    const req = httpMock.expectOne("/api/orders");
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);

    expect(result).toBeDefined();
    expect(result?.orderId).toBe("ORD-999");
    expect(result?.status).toBe("created");
    expect(result?.totalAmount).toBe(99.99);
  });

  it("should map init_point when provided by backend", () => {
    const payload: CreateOrderPayload = {
      customer: {
        name: "Jane Doe",
        email: "jane@example.com",
        address: "456 Market Ave",
        city: "San Francisco",
        zipCode: "94101",
      },
      items: [{ productId: "p1", quantity: 1, price: 99.99 }],
      totalAmount: 99.99,
    };

    const mockResponse = {
      init_point:
        "https://www.mercadopago.cl/checkout/v1/redirect?pref_id=12345",
      order_id: "ORD-INIT-123",
    };

    let result: OrderConfirmation | undefined;
    repository.createOrder(payload).subscribe((res) => {
      result = res;
    });

    const req = httpMock.expectOne("/api/orders");
    req.flush(mockResponse);

    expect(result).toBeDefined();
    expect(result?.orderId).toBe("ORD-INIT-123");
    expect(result?.initPoint).toBe(
      "https://www.mercadopago.cl/checkout/v1/redirect?pref_id=12345",
    );
  });

  it("should re-throw error when server responds with 400 Bad Request error", () => {
    const payload: CreateOrderPayload = {
      customer: {
        name: "John Smith",
        email: "john@example.com",
        address: "123 Main St",
        city: "Austin",
        zipCode: "78701",
      },
      items: [{ productId: "p2", quantity: 2, price: 50.0 }],
      totalAmount: 100.0,
    };

    let errorResult: any;
    repository.createOrder(payload).subscribe({
      next: () => {
        throw new Error("Should have failed");
      },
      error: (err) => {
        errorResult = err;
      },
    });

    const req = httpMock.expectOne("/api/orders");
    req.flush(
      { message: ["payer should not be empty"] },
      { status: 400, statusText: "Bad Request" },
    );

    expect(errorResult).toBeDefined();
    expect(errorResult.status).toBe(400);
    expect(errorResult.error.message).toEqual(["payer should not be empty"]);
  });

  it("should return fallback order confirmation when receiving non-JSON/HTML response", () => {
    const payload: CreateOrderPayload = {
      customer: {
        name: "John Smith",
        email: "john@example.com",
        address: "123 Main St",
        city: "Austin",
        zipCode: "78701",
      },
      items: [{ productId: "p2", quantity: 2, price: 50.0 }],
      totalAmount: 100.0,
    };

    let result: OrderConfirmation | undefined;
    repository.createOrder(payload).subscribe((res) => {
      result = res;
    });

    const req = httpMock.expectOne("/api/orders");
    req.flush("<!doctype html><html><body>SPA Rewrite</body></html>", {
      status: 200,
      statusText: "OK",
    });

    expect(result).toBeDefined();
    expect(result?.orderId).toMatch(/^ORD-\d+$/);
    expect(result?.status).toBe("created");
    expect(result?.totalAmount).toBe(100.0);
    expect(result?.message).toBe(
      "Pedido verificado exitosamente (modo contingencia)",
    );
  });

  it("should re-throw error when server responds with 500 JSON error message", () => {
    const payload: CreateOrderPayload = {
      customer: {
        name: "John Smith",
        email: "john@example.com",
        address: "123 Main St",
        city: "Austin",
        zipCode: "78701",
      },
      items: [{ productId: "p2", quantity: 2, price: 50.0 }],
      totalAmount: 100.0,
    };

    let errorResult: any;
    repository.createOrder(payload).subscribe({
      next: () => {
        throw new Error("Should have failed");
      },
      error: (err) => {
        errorResult = err;
      },
    });

    const req = httpMock.expectOne("/api/orders");
    req.flush(
      { message: "Pasarela de pago no disponible" },
      { status: 500, statusText: "Internal Server Error" },
    );

    expect(errorResult).toBeDefined();
    expect(errorResult.status).toBe(500);
    expect(errorResult.error.message).toBe("Pasarela de pago no disponible");
  });
});
