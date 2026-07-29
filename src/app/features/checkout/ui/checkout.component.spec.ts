import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CheckoutComponent } from "./checkout.component";
import { CheckoutStore } from "../state/checkout.store";
import { CartService } from "../../../core/cart.service";
import { provideRouter } from "@angular/router";
import { signal } from "@angular/core";

describe("CheckoutComponent UI", () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let mockCheckoutStore: any;

  beforeEach(async () => {
    mockCheckoutStore = {
      orderStatus: signal("idle"),
      isSubmitting: signal(false),
      errorMessage: signal(null),
      orderConfirmation: signal(null),
      submitOrder: vi.fn(),
      resetCheckout: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CheckoutComponent],
      providers: [
        provideRouter([]),
        CartService,
        { provide: CheckoutStore, useValue: mockCheckoutStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the checkout component", () => {
    expect(component).toBeTruthy();
  });

  it("should render checkout form with all data-testid inputs", () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(
      compiled.querySelector('[data-testid="checkout-form"]'),
    ).toBeTruthy();
    expect(
      compiled.querySelector('[data-testid="customer-name"]'),
    ).toBeTruthy();
    expect(
      compiled.querySelector('[data-testid="customer-email"]'),
    ).toBeTruthy();
    expect(
      compiled.querySelector('[data-testid="customer-address"]'),
    ).toBeTruthy();
    expect(
      compiled.querySelector('[data-testid="customer-city"]'),
    ).toBeTruthy();
    expect(compiled.querySelector('[data-testid="customer-zip"]')).toBeTruthy();
    expect(
      compiled.querySelector('[data-testid="submit-order-btn"]'),
    ).toBeTruthy();
  });

  it("should trigger submitOrder on form submit when inputs are valid and cart is not empty", () => {
    component.cartService.addToCart(
      {
        id: "p1",
        name: "Item",
        title: "Item",
        price: 100,
        stock: 5,
        category: "Cat",
        imageUrl: "img.jpg",
        description: "Desc",
      },
      1,
    );

    component.customer = {
      name: "Alex Developer",
      email: "alex@example.com",
      address: "123 Cloudforge St",
      city: "Tech City",
      zipCode: "90210",
    };

    component.onSubmit();
    expect(mockCheckoutStore.submitOrder).toHaveBeenCalledWith(
      component.customer,
    );
  });

  it("should display order confirmation screen when orderConfirmation signal is populated", () => {
    mockCheckoutStore.orderConfirmation.set({
      orderId: "ORD-TEST-123",
      status: "created",
      totalAmount: 5000,
    });
    mockCheckoutStore.orderStatus.set("success");
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(
      compiled.querySelector('[data-testid="order-confirmation"]'),
    ).toBeTruthy();
    expect(
      compiled.querySelector('[data-testid="order-success"]'),
    ).toBeTruthy();
    expect(compiled.textContent).toContain("ORD-TEST-123");
  });

  describe("Tier 5 Adversarial UI Edge Cases", () => {
    it("TC-ADV-UI-01: should reject form submission with whitespace-only inputs", () => {
      component.cartService.addToCart(
        {
          id: "p1",
          name: "Item",
          title: "Item",
          price: 100,
          stock: 5,
          category: "Cat",
          imageUrl: "img.jpg",
          description: "Desc",
        },
        1,
      );

      component.customer = {
        name: "   ",
        email: "alex@example.com",
        address: "   ",
        city: "Tech City",
        zipCode: "90210",
      };

      component.onSubmit();
      expect(mockCheckoutStore.submitOrder).not.toHaveBeenCalled();
      expect(component.formSubmitted).toBe(true);
    });

    it("TC-ADV-UI-02: should prevent submitOrder when cart is empty even with valid inputs", () => {
      component.cartService.clearCart();
      component.customer = {
        name: "Alex Developer",
        email: "alex@example.com",
        address: "123 Cloudforge St",
        city: "Tech City",
        zipCode: "90210",
      };

      component.onSubmit();
      expect(mockCheckoutStore.submitOrder).not.toHaveBeenCalled();
    });

    it("TC-ADV-UI-03: should render error message banner when checkoutStore.errorMessage is present", () => {
      mockCheckoutStore.errorMessage.set("Submission timed out on server");
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain("Submission timed out on server");
    });
  });
});
