import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProductDetailComponent } from "./product-detail.component";
import { ActivatedRoute, convertToParamMap, Router } from "@angular/router";
import { of } from "rxjs";
import { CatalogRepository } from "../../domain/catalog.repository";
import { MockCatalogRepository } from "../../data/mock-catalog.repository";
import { CartService } from "../../../../core/cart.service";
import { vi } from "vitest";

describe("ProductDetailComponent", () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let cartService: CartService;
  let mockActivatedRoute: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      paramMap: of(convertToParamMap({ id: "prod-test-01" })),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: CatalogRepository, useClass: MockCatalogRepository },
        CartService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
  });

  it("should create product detail component", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should load and display product details", () => {
    fixture.detectChanges();

    expect(component.loading()).toBeFalsy();
    expect(component.product()).toBeTruthy();
    expect(component.product()?.id).toBe("prod-test-01");

    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('[data-testid="product-name"]');
    const descElement = compiled.querySelector(
      '[data-testid="product-description"]',
    );
    const priceElement = compiled.querySelector(
      '[data-testid="product-price"]',
    );

    expect(titleElement?.textContent).toContain(
      "Producto de Prueba Cloudforge",
    );
    expect(descElement?.textContent).toContain(
      "Instancia cloud de prueba de alto rendimiento",
    );
    expect(priceElement?.textContent).toContain("15");
    expect(priceElement?.textContent).toContain("000");
  });

  it("should manage quantity selector correctly within stock limits", () => {
    fixture.detectChanges();

    expect(component.quantity()).toBe(1);

    // Increment
    component.incrementQuantity(50);
    expect(component.quantity()).toBe(2);

    // Decrement
    component.decrementQuantity();
    expect(component.quantity()).toBe(1);

    // Can't decrement below 1
    component.decrementQuantity();
    expect(component.quantity()).toBe(1);
  });

  it("should add product to cart with selected quantity and open cart", () => {
    const addItemSpy = vi.spyOn(cartService, "addItem");
    const openCartSpy = vi.spyOn(cartService, "openCart");

    fixture.detectChanges();

    component.quantity.set(3);
    component.addToCart(component.product()!);

    expect(addItemSpy).toHaveBeenCalledWith(component.product()!, 3);
    expect(openCartSpy).toHaveBeenCalled();
  });

  it("should render not found state if product id is invalid", () => {
    mockActivatedRoute.paramMap = of(convertToParamMap({ id: "invalid-id" }));

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.loading()).toBeFalsy();
    expect(component.product()).toBeUndefined();

    const compiled = fixture.nativeElement as HTMLElement;
    const notFoundEl = compiled.querySelector(
      '[data-testid="not-found-state"]',
    );
    expect(notFoundEl).toBeTruthy();
  });
});
