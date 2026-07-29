import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartDrawerComponent } from './cart-drawer.component';
import { CartService } from '../state/cart.service';
import { Router } from '@angular/router';
import { Product } from '../../catalog/domain/product.model';
import { vi } from 'vitest';

describe('CartDrawerComponent', () => {
  let component: CartDrawerComponent;
  let fixture: ComponentFixture<CartDrawerComponent>;
  let cartService: CartService;

  const mockProduct: Product = {
    id: 'prod-01',
    name: 'Cloud Database',
    title: 'Cloud Database',
    description: 'Managed PostgreSQL Instance',
    price: 30000,
    category: 'Database',
    imageUrl: 'assets/images/db.jpg',
    stock: 3
  };

  const mockRouter = {
    navigate: vi.fn()
  };

  beforeEach(async () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    mockRouter.navigate.mockReset();
    await TestBed.configureTestingModule({
      imports: [CartDrawerComponent],
      providers: [
        CartService,
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartDrawerComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    cartService.clearCart();
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should not render drawer in DOM when isCartOpen is false', () => {
    cartService.closeCart();
    fixture.detectChanges();
    const drawerEl = fixture.nativeElement.querySelector('[data-testid="cart-drawer"]');
    expect(drawerEl).toBeNull();
  });

  it('should render drawer in DOM when isCartOpen is true', () => {
    cartService.openCart();
    fixture.detectChanges();
    const drawerEl = fixture.nativeElement.querySelector('[data-testid="cart-drawer"]');
    expect(drawerEl).not.toBeNull();
  });

  it('should display empty cart message and disabled checkout button when cart is empty', () => {
    cartService.openCart();
    cartService.clearCart();
    fixture.detectChanges();

    const emptyMsg = fixture.nativeElement.querySelector('[data-testid="empty-cart-message"]');
    const checkoutBtn = fixture.nativeElement.querySelector('[data-testid="proceed-to-checkout-btn"]');

    expect(emptyMsg).not.toBeNull();
    expect(checkoutBtn.disabled).toBe(true);
  });

  it('should render cart items, total amount, and enabled checkout button when items are added', () => {
    cartService.openCart();
    cartService.addToCart(mockProduct, 2);
    fixture.detectChanges();

    const cartItem = fixture.nativeElement.querySelector('[data-testid="cart-item"]');
    const qtyText = fixture.nativeElement.querySelector('[data-testid="item-quantity"]');
    const cartTotal = fixture.nativeElement.querySelector('[data-testid="cart-total"]');
    const checkoutBtn = fixture.nativeElement.querySelector('[data-testid="proceed-to-checkout-btn"]');

    expect(cartItem).not.toBeNull();
    expect(qtyText.textContent).toContain('2');
    expect(cartTotal.textContent).toContain('60,000');
    expect(checkoutBtn.disabled).toBe(false);
  });

  it('should update quantity when increment and decrement buttons are clicked', () => {
    cartService.openCart();
    cartService.addToCart(mockProduct, 1);
    fixture.detectChanges();

    const incBtn = fixture.nativeElement.querySelector('[data-testid="qty-increment"]');
    incBtn.click();
    fixture.detectChanges();
    expect(cartService.cartItems()[0].quantity).toBe(2);

    const decBtn = fixture.nativeElement.querySelector('[data-testid="qty-decrement"]');
    decBtn.click();
    fixture.detectChanges();
    expect(cartService.cartItems()[0].quantity).toBe(1);
  });

  it('should disable increment button when item quantity reaches stock limit', () => {
    cartService.openCart();
    cartService.addToCart(mockProduct, 3); // stock is 3
    fixture.detectChanges();

    const incBtn = fixture.nativeElement.querySelector('[data-testid="qty-increment"]');
    expect(incBtn.disabled).toBe(true);
  });

  it('should remove item when remove button is clicked', () => {
    cartService.openCart();
    cartService.addToCart(mockProduct, 1);
    fixture.detectChanges();

    const removeBtn = fixture.nativeElement.querySelector('[data-testid="remove-item-btn"]');
    removeBtn.click();
    fixture.detectChanges();

    expect(cartService.cartItems().length).toBe(0);
  });

  it('should close cart and navigate to /checkout when proceed-to-checkout button is clicked', () => {
    cartService.openCart();
    cartService.addToCart(mockProduct, 1);
    fixture.detectChanges();

    const checkoutBtn = fixture.nativeElement.querySelector('[data-testid="proceed-to-checkout-btn"]');
    checkoutBtn.click();

    expect(cartService.isCartOpen()).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/checkout']);
  });

  it('should close cart when close button or backdrop is clicked', () => {
    cartService.openCart();
    fixture.detectChanges();

    const closeBtn = fixture.nativeElement.querySelector('[data-testid="cart-close-btn"]');
    closeBtn.click();
    fixture.detectChanges();
    expect(cartService.isCartOpen()).toBe(false);
  });
});
