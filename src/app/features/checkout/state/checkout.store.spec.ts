import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CheckoutStore } from './checkout.store';
import { OrderRepository } from '../data/order.repository';
import { CartService } from '../../../core/cart.service';
import { CustomerInfo, OrderConfirmation } from '../domain/order.model';

describe('CheckoutStore', () => {
  let store: CheckoutStore;
  let mockOrderRepository: any;
  let cartService: CartService;

  beforeEach(() => {
    mockOrderRepository = {
      createOrder: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        CheckoutStore,
        CartService,
        { provide: OrderRepository, useValue: mockOrderRepository }
      ]
    });

    store = TestBed.inject(CheckoutStore);
    cartService = TestBed.inject(CartService);

    cartService.addToCart({
      id: 'prod-1',
      name: 'Test Product',
      title: 'Test Product',
      price: 100,
      category: 'Electronics',
      stock: 10,
      imageUrl: 'test.jpg',
      description: 'Test desc'
    }, 2);
  });

  it('should initialize with idle status', () => {
    expect(store.orderStatus()).toBe('idle');
    expect(store.isSubmitting()).toBe(false);
    expect(store.errorMessage()).toBeNull();
    expect(store.orderConfirmation()).toBeNull();
  });

  it('should submit order successfully and clear cart', () => {
    const mockConfirmation: OrderConfirmation = {
      orderId: 'ORD-12345',
      status: 'created',
      totalAmount: 200
    };

    mockOrderRepository.createOrder.mockReturnValue(of(mockConfirmation));

    const customer: CustomerInfo = {
      name: 'Alex Developer',
      email: 'alex@example.com',
      address: '123 Cloudforge St',
      city: 'Tech City',
      zipCode: '90210'
    };

    store.submitOrder(customer);

    expect(store.orderStatus()).toBe('success');
    expect(store.isSubmitting()).toBe(false);
    expect(store.orderConfirmation()).toEqual(mockConfirmation);
    expect(cartService.cartItems().length).toBe(0);
  });

  it('should handle order submission error', () => {
    mockOrderRepository.createOrder.mockReturnValue(
      throwError(() => new Error('Server error'))
    );

    const customer: CustomerInfo = {
      name: 'Alex Developer',
      email: 'alex@example.com',
      address: '123 Cloudforge St',
      city: 'Tech City',
      zipCode: '90210'
    };

    store.submitOrder(customer);

    expect(store.orderStatus()).toBe('error');
    expect(store.isSubmitting()).toBe(false);
    expect(store.errorMessage()).toBe('Server error');
  });

  it('should reset checkout state', () => {
    store.orderStatus.set('error');
    store.errorMessage.set('Test error');
    store.resetCheckout();

    expect(store.orderStatus()).toBe('idle');
    expect(store.errorMessage()).toBeNull();
  });

  describe('Tier 5 Adversarial Edge Cases', () => {
    it('TC-ADV-CHK-01: should reject order submission when cart is empty', () => {
      cartService.clearCart();
      const customer: CustomerInfo = {
        name: 'Alex Developer',
        email: 'alex@example.com',
        address: '123 Cloudforge St',
        city: 'Tech City',
        zipCode: '90210'
      };

      let thrownErr: any = null;
      try {
        store.submitOrder(customer);
      } catch (err) {
        thrownErr = err;
      }

      expect(store.orderStatus()).toBe('error');
      expect(store.errorMessage()).toContain('vacío');
      expect(mockOrderRepository.createOrder).not.toHaveBeenCalled();
    });

    it('TC-ADV-CHK-02: should reject duplicate submitOrder call when submission is in progress', () => {
      store.isSubmitting.set(true);
      const customer: CustomerInfo = {
        name: 'Alex Developer',
        email: 'alex@example.com',
        address: '123 Cloudforge St',
        city: 'Tech City',
        zipCode: '90210'
      };

      let thrownErr: any = null;
      try {
        store.submitOrder(customer);
      } catch (err) {
        thrownErr = err;
      }

      expect(mockOrderRepository.createOrder).not.toHaveBeenCalled();
    });

    it('TC-ADV-CHK-03: should preserve cart items when server returns submission error', () => {
      mockOrderRepository.createOrder.mockReturnValue(
        throwError(() => ({ error: { message: 'Database connection failed' } }))
      );

      const customer: CustomerInfo = {
        name: 'Alex Developer',
        email: 'alex@example.com',
        address: '123 Cloudforge St',
        city: 'Tech City',
        zipCode: '90210'
      };

      store.submitOrder(customer);

      expect(store.orderStatus()).toBe('error');
      expect(store.errorMessage()).toBe('Database connection failed');
      // Cart items should NOT be cleared on failure
      expect(cartService.cartItems().length).toBe(1);
    });
  });
});
