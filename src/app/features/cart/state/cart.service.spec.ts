import { TestBed } from "@angular/core/testing";
import { CartService } from "./cart.service";
import { Product } from "../../catalog/domain/product.model";

describe("CartService (Vertical Slice)", () => {
  let service: CartService;

  const mockProduct1: Product = {
    id: "prod-01",
    name: "Cloud Virtual Machine",
    title: "Cloud Virtual Machine",
    description: "High performance compute instance",
    price: 25000,
    category: "Compute",
    imageUrl: "assets/images/vm.jpg",
    stock: 5,
  };

  const mockProduct2: Product = {
    id: "prod-02",
    name: "Object Storage Bucket",
    title: "Object Storage Bucket",
    description: "Scalable S3 compatible storage",
    price: 12000,
    category: "Storage",
    imageUrl: "assets/images/storage.jpg",
    stock: 2,
  };

  const outOfStockProduct: Product = {
    id: "prod-03",
    name: "Managed Kubernetes Cluster",
    title: "Managed Kubernetes Cluster",
    description: "Auto-scaling K8s control plane",
    price: 50000,
    category: "Containers",
    imageUrl: "assets/images/k8s.jpg",
    stock: 0,
  };

  beforeEach(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
    service.clearCart();
  });

  it("should initialize with empty cart state and drawer closed", () => {
    expect(service.cartItems().length).toBe(0);
    expect(service.totalItemsCount()).toBe(0);
    expect(service.totalAmount()).toBe(0);
    expect(service.isCartOpen()).toBe(false);
  });

  it("should toggle, open, and close cart drawer signal state", () => {
    expect(service.isCartOpen()).toBe(false);
    service.openCart();
    expect(service.isCartOpen()).toBe(true);
    service.closeCart();
    expect(service.isCartOpen()).toBe(false);
    service.toggleCart();
    expect(service.isCartOpen()).toBe(true);
    service.toggleCart();
    expect(service.isCartOpen()).toBe(false);
  });

  it("should add products to cart and compute total items and amount", () => {
    service.addToCart(mockProduct1, 2);
    expect(service.cartItems().length).toBe(1);
    expect(service.totalItemsCount()).toBe(2);
    expect(service.totalAmount()).toBe(50000);

    service.addToCart(mockProduct2, 1);
    expect(service.cartItems().length).toBe(2);
    expect(service.totalItemsCount()).toBe(3);
    expect(service.totalAmount()).toBe(62000);
  });

  it("should clamp added quantity at available product stock", () => {
    service.addToCart(mockProduct1, 10); // Stock is 5
    expect(service.cartItems()[0].quantity).toBe(5);
    expect(service.totalItemsCount()).toBe(5);

    // Attempt to add more to existing item
    service.addToCart(mockProduct1, 2);
    expect(service.cartItems()[0].quantity).toBe(5);
  });

  it("should not add out-of-stock products", () => {
    service.addToCart(outOfStockProduct, 1);
    expect(service.cartItems().length).toBe(0);
  });

  it("should update item quantity and clamp at product stock", () => {
    service.addToCart(mockProduct2, 1); // Stock is 2
    service.updateQuantity("prod-02", 5);
    expect(service.cartItems()[0].quantity).toBe(2);
  });

  it("should remove item when updateQuantity is called with quantity <= 0", () => {
    service.addToCart(mockProduct1, 2);
    service.updateQuantity("prod-01", 0);
    expect(service.cartItems().length).toBe(0);
    expect(service.totalItemsCount()).toBe(0);
  });

  it("should remove item from cart by productId", () => {
    service.addToCart(mockProduct1, 1);
    service.addToCart(mockProduct2, 1);
    expect(service.cartItems().length).toBe(2);

    service.removeFromCart("prod-01");
    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].product.id).toBe("prod-02");
  });

  it("should clear cart state completely and remove key from localStorage", () => {
    service.addToCart(mockProduct1, 2);
    service.addToCart(mockProduct2, 1);
    expect(service.cartItems().length).toBe(2);

    service.clearCart();
    expect(service.cartItems().length).toBe(0);
    expect(service.totalItemsCount()).toBe(0);
    expect(service.totalAmount()).toBe(0);
    expect(localStorage.getItem("cloudforge_cart_items")).toBeNull();
  });

  it("should persist cart items to localStorage on add and quantity update", () => {
    service.addToCart(mockProduct1, 2);
    const saved = localStorage.getItem("cloudforge_cart_items");
    expect(saved).not.toBeNull();
    const items = JSON.parse(saved!);
    expect(items.length).toBe(1);
    expect(items[0].product.id).toBe("prod-01");
    expect(items[0].quantity).toBe(2);
  });

  it("should load saved cart items from localStorage on initialization", () => {
    const savedItems = [{ product: mockProduct1, quantity: 3 }];
    localStorage.setItem("cloudforge_cart_items", JSON.stringify(savedItems));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [CartService]
    });
    const newService = TestBed.inject(CartService);
    expect(newService.cartItems().length).toBe(1);
    expect(newService.cartItems()[0].quantity).toBe(3);
  });

  it("should handle invalid JSON in localStorage gracefully on initialization", () => {
    localStorage.setItem("cloudforge_cart_items", "invalid-json-{");
    // Service initialization with invalid JSON should fallback to empty array without crashing
    const items = service["loadInitialCart"]();
    expect(items).toEqual([]);
  });

  describe("Tier 5 Adversarial Edge Cases", () => {
    it("TC-ADV-CART-01: should fallback to empty array when localStorage contains non-array JSON object", () => {
      localStorage.setItem(
        "cloudforge_cart_items",
        JSON.stringify({ maliciousKey: "fakeData" }),
      );
      const items = service["loadInitialCart"]();
      expect(items).toEqual([]);
      expect(Array.isArray(items)).toBe(true);
    });

    it("TC-ADV-CART-02: should ignore zero or negative quantity in addToCart", () => {
      service.addToCart(mockProduct1, 0);
      expect(service.cartItems().length).toBe(0);

      service.addToCart(mockProduct1, -5);
      expect(service.cartItems().length).toBe(0);
      expect(service.totalItemsCount()).toBe(0);
      expect(service.totalAmount()).toBe(0);
    });

    it("TC-ADV-CART-03: should remove item when updateQuantity is called with negative quantity", () => {
      service.addToCart(mockProduct1, 2);
      expect(service.cartItems().length).toBe(1);

      service.updateQuantity("prod-01", -10);
      expect(service.cartItems().length).toBe(0);
      expect(service.totalItemsCount()).toBe(0);
    });

    it("TC-ADV-CART-04: should handle increment and decrement on non-existent product IDs gracefully", () => {
      service.addToCart(mockProduct1, 1);
      service.incrementQuantity("non-existent-id");
      service.decrementQuantity("non-existent-id");
      expect(service.cartItems().length).toBe(1);
      expect(service.cartItems()[0].quantity).toBe(1);
    });

    it("TC-ADV-CART-05: should handle removeFromCart on non-existent or empty cart gracefully", () => {
      service.removeFromCart("unknown-id");
      expect(service.cartItems().length).toBe(0);

      service.addToCart(mockProduct1, 2);
      service.removeFromCart("unknown-id");
      expect(service.cartItems().length).toBe(1);
    });
  });
});
