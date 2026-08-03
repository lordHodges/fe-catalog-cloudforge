import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { CartService } from "./cart.service";
import { AuthService } from "../../../core/services/auth.service";
import { signal } from "@angular/core";
import { Product } from "../../catalog/domain/product.model";
import { CartItem } from "../domain/cart.model";

describe("CartService Syncing", () => {
  let service: CartService;
  let httpMock: HttpTestingController;
  let authServiceMock: any;

  const mockProduct1: Product = {
    id: "prod-01",
    name: "Product 1",
    title: "Product 1",
    description: "Description 1",
    price: 100,
    category: "Category 1",
    imageUrl: "img1.jpg",
    stock: 10,
  };

  const mockProduct2: Product = {
    id: "prod-02",
    name: "Product 2",
    title: "Product 2",
    description: "Description 2",
    price: 200,
    category: "Category 2",
    imageUrl: "img2.jpg",
    stock: 5,
  };

  beforeEach(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }

    authServiceMock = {
      token: signal<string | null>("mock-token"),
      isAuthenticated: signal<boolean>(true),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CartService,
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should post to backend when addToCart is called while authenticated", () => {
    service.addToCart(mockProduct1, 2);

    const req = httpMock.expectOne("/api/cart");
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({
      items: [{ product: mockProduct1, quantity: 2 }],
    });
    req.flush({});
  });

  it("should fetch, merge, and save cart when syncCartOnLogin is called", () => {
    // Add local item
    service.addToCart(mockProduct1, 2);
    // Flush the initial persist from addToCart
    const initialPersist = httpMock.expectOne("/api/cart");
    initialPersist.flush({});

    // Remote items to return from GET
    const remoteItems: CartItem[] = [
      { product: mockProduct1, quantity: 3 }, // Overlapping product
      { product: mockProduct2, quantity: 1 }, // Unique remote product
    ];

    service.syncCartOnLogin().subscribe((merged) => {
      expect(merged.length).toBe(2);
      
      const item1 = merged.find(i => i.product.id === mockProduct1.id);
      const item2 = merged.find(i => i.product.id === mockProduct2.id);

      expect(item1).toBeDefined();
      expect(item2).toBeDefined();

      // Overlapping: 2 local + 3 remote = 5 (within stock 10)
      expect(item1!.quantity).toBe(5);
      expect(item2!.quantity).toBe(1);
    });

    // 1. expect GET request
    const getReq = httpMock.expectOne("/api/cart");
    expect(getReq.request.method).toBe("GET");
    getReq.flush(remoteItems);

    // 2. expect POST request with merged items
    const postReq = httpMock.expectOne("/api/cart");
    expect(postReq.request.method).toBe("POST");
    expect(postReq.request.body.items.length).toBe(2);
    postReq.flush({});
  });
});

