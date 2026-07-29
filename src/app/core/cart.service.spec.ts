import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from './product.model';

describe('CartService', () => {
  let service: CartService;

  const mockProduct: Product = {
    id: 'prod-test-01',
    name: 'Producto de Prueba Cloudforge',
    title: 'Producto de Prueba Cloudforge',
    description: 'Test product',
    price: 15000,
    category: 'Infrastructure',
    imageUrl: 'assets/images/prod-test-01.jpg',
    stock: 5
  };

  const outOfStockProduct: Product = {
    id: 'prod-test-02',
    name: 'Producto Agotado',
    title: 'Producto Agotado',
    description: 'Out of stock product',
    price: 10000,
    category: 'Serverless',
    imageUrl: 'assets/images/prod-test-02.jpg',
    stock: 0
  };

  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
    service.clearCart();
  });

  it('should be created with empty cart', () => {
    expect(service).toBeTruthy();
    expect(service.cartItems().length).toBe(0);
    expect(service.totalItemsCount()).toBe(0);
    expect(service.totalAmount()).toBe(0);
    expect(service.isEmpty()).toBe(true);
    expect(service.isOpen()).toBe(false);
  });

  it('should toggle, open, and close cart drawer state', () => {
    expect(service.isOpen()).toBe(false);
    service.toggleCart();
    expect(service.isOpen()).toBe(true);
    service.closeCart();
    expect(service.isOpen()).toBe(false);
    service.openCart();
    expect(service.isOpen()).toBe(true);
  });

  it('should add item to cart', () => {
    service.addItem(mockProduct);
    expect(service.cartItems().length).toBe(1);
    expect(service.totalItemsCount()).toBe(1);
    expect(service.totalAmount()).toBe(15000);
    expect(service.isEmpty()).toBe(false);
  });

  it('should not add out-of-stock product', () => {
    service.addItem(outOfStockProduct);
    expect(service.cartItems().length).toBe(0);
    expect(service.isEmpty()).toBe(true);
  });

  it('should enforce stock boundaries when adding items', () => {
    service.addItem(mockProduct, 10); // stock is 5
    expect(service.cartItems()[0].quantity).toBe(5);
    expect(service.totalItemsCount()).toBe(5);
  });

  it('should increment quantity up to stock limit', () => {
    service.addItem(mockProduct, 4);
    service.incrementQuantity('prod-test-01');
    expect(service.cartItems()[0].quantity).toBe(5);

    // Attempting to increment past stock (5)
    service.incrementQuantity('prod-test-01');
    expect(service.cartItems()[0].quantity).toBe(5);
  });

  it('should decrement quantity and remove item when reaching 0', () => {
    service.addItem(mockProduct, 2);
    service.decrementQuantity('prod-test-01');
    expect(service.cartItems()[0].quantity).toBe(1);

    service.decrementQuantity('prod-test-01');
    expect(service.cartItems().length).toBe(0);
    expect(service.isEmpty()).toBe(true);
  });

  it('should update quantity and remove item if quantity <= 0', () => {
    service.addItem(mockProduct, 2);
    service.updateQuantity('prod-test-01', 4);
    expect(service.totalItemsCount()).toBe(4);

    service.updateQuantity('prod-test-01', 0);
    expect(service.cartItems().length).toBe(0);
  });

  it('should remove item by ID', () => {
    service.addItem(mockProduct);
    service.removeItem('prod-test-01');
    expect(service.cartItems().length).toBe(0);
  });

  it('should clear cart completely', () => {
    service.addItem(mockProduct, 3);
    service.clearCart();
    expect(service.cartItems().length).toBe(0);
    expect(service.totalItemsCount()).toBe(0);
    expect(service.isEmpty()).toBe(true);
  });
});
