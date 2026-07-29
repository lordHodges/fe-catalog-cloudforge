import { Injectable, signal, computed, WritableSignal, Signal } from '@angular/core';
import { CartItem } from '../domain/cart.model';
import { Product } from '../../catalog/domain/product.model';

const CART_STORAGE_KEY = 'cloudforge_cart_items';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private loadInitialCart(): CartItem[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (!saved) return [];
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }

  private saveCart(items: CartItem[]): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch {}
    }
  }

  readonly cartItems: WritableSignal<CartItem[]> = signal<CartItem[]>(this.loadInitialCart());
  readonly isCartOpen: WritableSignal<boolean> = signal<boolean>(false);

  readonly isOpen: Signal<boolean> = computed(() => this.isCartOpen());
  readonly isEmpty: Signal<boolean> = computed(() => this.cartItems().length === 0);

  readonly totalItemsCount: Signal<number> = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly totalAmount: Signal<number> = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  addToCart(product: Product, quantity = 1): void {
    if (!product || product.stock <= 0 || quantity <= 0) return;

    this.cartItems.update(items => {
      let updated: CartItem[];
      const existingIndex = items.findIndex(i => String(i.product.id) === String(product.id));
      if (existingIndex > -1) {
        updated = [...items];
        const existing = updated[existingIndex];
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        updated[existingIndex] = { ...existing, quantity: newQty };
      } else {
        const initialQty = Math.min(quantity, product.stock);
        updated = [...items, { product, quantity: initialQty }];
      }
      this.saveCart(updated);
      return updated;
    });
  }

  addItem(product: Product, quantity = 1): void {
    this.addToCart(product, quantity);
  }

  updateQuantity(productId: string | number, quantity: number): void {
    this.cartItems.update(items => {
      let updated: CartItem[];
      if (quantity <= 0) {
        updated = items.filter(i => String(i.product.id) !== String(productId));
      } else {
        updated = items.map(item => {
          if (String(item.product.id) === String(productId)) {
            const clampedQty = Math.min(quantity, item.product.stock);
            return { ...item, quantity: clampedQty };
          }
          return item;
        });
      }
      this.saveCart(updated);
      return updated;
    });
  }

  incrementQuantity(productId: string | number): void {
    const item = this.cartItems().find(i => String(i.product.id) === String(productId));
    if (item) {
      this.updateQuantity(productId, item.quantity + 1);
    }
  }

  decrementQuantity(productId: string | number): void {
    const item = this.cartItems().find(i => String(i.product.id) === String(productId));
    if (item) {
      this.updateQuantity(productId, item.quantity - 1);
    }
  }

  removeFromCart(productId: string | number): void {
    this.cartItems.update(items => {
      const updated = items.filter(i => String(i.product.id) !== String(productId));
      this.saveCart(updated);
      return updated;
    });
  }

  removeItem(productId: string | number): void {
    this.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartItems.set([]);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem(CART_STORAGE_KEY);
      } catch {}
    }
  }

  toggleCart(): void {
    this.isCartOpen.update(isOpen => !isOpen);
  }

  openCart(): void {
    this.isCartOpen.set(true);
  }

  closeCart(): void {
    this.isCartOpen.set(false);
  }
}
