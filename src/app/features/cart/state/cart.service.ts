import {
  Injectable,
  signal,
  computed,
  WritableSignal,
  Signal,
  effect,
  untracked,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "../../../core/services/auth.service";
import { Observable, of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { CartItem } from "../domain/cart.model";
import { Product } from "../../catalog/domain/product.model";

const CART_STORAGE_KEY = "cloudforge_cart_items";

@Injectable({
  providedIn: "root",
})
export class CartService {
  private authService = inject(AuthService, { optional: true });
  private http = inject(HttpClient, { optional: true });

  constructor() {
    if (this.authService) {
      effect(() => {
        const isAuth = this.authService!.isAuthenticated();
        if (isAuth) {
          untracked(() => {
            this.syncCartOnLogin().subscribe();
          });
        }
      });
    }
  }

  private loadInitialCart(): CartItem[] {
    if (typeof window !== "undefined" && window.localStorage) {
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
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch {}
    }
  }

  readonly cartItems: WritableSignal<CartItem[]> = signal<CartItem[]>(
    this.loadInitialCart(),
  );
  readonly isCartOpen: WritableSignal<boolean> = signal<boolean>(false);

  readonly isOpen: Signal<boolean> = computed(() => this.isCartOpen());
  readonly isEmpty: Signal<boolean> = computed(
    () => this.cartItems().length === 0,
  );

  readonly totalItemsCount: Signal<number> = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0),
  );

  readonly totalAmount: Signal<number> = computed(() =>
    this.cartItems().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    ),
  );

  addToCart(product: Product, quantity = 1): void {
    if (!product || product.stock <= 0 || quantity <= 0) return;

    this.cartItems.update((items) => {
      let updated: CartItem[];
      const existingIndex = items.findIndex(
        (i) => String(i.product.id) === String(product.id),
      );
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
    this.persistCartBackend();
  }

  addItem(product: Product, quantity = 1): void {
    this.addToCart(product, quantity);
  }

  updateQuantity(productId: string | number, quantity: number): void {
    this.cartItems.update((items) => {
      let updated: CartItem[];
      if (quantity <= 0) {
        updated = items.filter(
          (i) => String(i.product.id) !== String(productId),
        );
      } else {
        updated = items.map((item) => {
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
    this.persistCartBackend();
  }

  incrementQuantity(productId: string | number): void {
    const item = this.cartItems().find(
      (i) => String(i.product.id) === String(productId),
    );
    if (item) {
      this.updateQuantity(productId, item.quantity + 1);
    }
  }

  decrementQuantity(productId: string | number): void {
    const item = this.cartItems().find(
      (i) => String(i.product.id) === String(productId),
    );
    if (item) {
      this.updateQuantity(productId, item.quantity - 1);
    }
  }

  removeFromCart(productId: string | number): void {
    this.cartItems.update((items) => {
      const updated = items.filter(
        (i) => String(i.product.id) !== String(productId),
      );
      this.saveCart(updated);
      return updated;
    });
    this.persistCartBackend();
  }

  removeItem(productId: string | number): void {
    this.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartItems.set([]);
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        localStorage.removeItem(CART_STORAGE_KEY);
      } catch {}
    }
    this.persistCartBackend();
  }

  toggleCart(): void {
    this.isCartOpen.update((isOpen) => !isOpen);
  }

  openCart(): void {
    this.isCartOpen.set(true);
  }

  closeCart(): void {
    this.isCartOpen.set(false);
  }

  syncCartOnLogin(): Observable<CartItem[]> {
    if (
      !this.authService ||
      !this.authService.isAuthenticated() ||
      !this.http
    ) {
      return of(this.cartItems());
    }

    const localItems = this.cartItems();

    return this.http.get<CartItem[] | { items: CartItem[] }>("/api/cart").pipe(
      map((res) => {
        const remoteItems = Array.isArray(res) ? res : (res && res.items) || [];
        return remoteItems;
      }),
      catchError(() => {
        return of([] as CartItem[]);
      }),
      switchMap((remoteItems) => {
        const mergedMap = new Map<string | number, CartItem>();

        remoteItems.forEach((item) => {
          if (item && item.product) {
            mergedMap.set(item.product.id, { ...item });
          }
        });

        localItems.forEach((localItem) => {
          const existing = mergedMap.get(localItem.product.id);
          if (existing) {
            const newQty = Math.min(
              existing.quantity + localItem.quantity,
              localItem.product.stock,
            );
            mergedMap.set(localItem.product.id, {
              ...existing,
              quantity: newQty,
            });
          } else {
            mergedMap.set(localItem.product.id, { ...localItem });
          }
        });

        const mergedItems = Array.from(mergedMap.values());

        this.cartItems.set(mergedItems);
        this.saveCart(mergedItems);

        return this.http!.post<any>("/api/cart", { items: mergedItems }).pipe(
          map(() => mergedItems),
          catchError(() => of(mergedItems)),
        );
      }),
    );
  }

  private persistCartBackend(): void {
    if (this.authService && this.authService.isAuthenticated() && this.http) {
      this.http
        .post<any>("/api/cart", { items: this.cartItems() })
        .pipe(catchError(() => of(null)))
        .subscribe();
    }
  }
}
