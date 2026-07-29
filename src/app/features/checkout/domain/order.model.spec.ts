import {
  CustomerInfo,
  OrderItemPayload,
  CreateOrderPayload,
  OrderConfirmation,
} from "./order.model";

describe("Order Models Domain", () => {
  it("should correctly construct CreateOrderPayload model", () => {
    const customer: CustomerInfo = {
      name: "Alex Developer",
      email: "alex@example.com",
      address: "123 Cloudforge St",
      city: "Tech City",
      zipCode: "90210",
    };

    const items: OrderItemPayload[] = [
      { productId: "prod-1", quantity: 2, price: 1500 },
    ];

    const payload: CreateOrderPayload = {
      customer,
      items,
      totalAmount: 3000,
    };

    expect(payload.customer.name).toBe("Alex Developer");
    expect(payload.customer.zipCode).toBe("90210");
    expect(payload.items.length).toBe(1);
    expect(payload.items[0].productId).toBe("prod-1");
    expect(payload.totalAmount).toBe(3000);
  });

  it("should structure OrderConfirmation model correctly", () => {
    const confirmation: OrderConfirmation = {
      orderId: "ORD-TEST-12345",
      status: "created",
      totalAmount: 3000,
      createdAt: "2026-07-28T08:00:00Z",
      message: "Order created successfully",
    };

    expect(confirmation.orderId).toBe("ORD-TEST-12345");
    expect(confirmation.status).toBe("created");
    expect(confirmation.message).toBe("Order created successfully");
  });
});
