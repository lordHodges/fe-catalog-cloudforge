import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';
import { OrderRepository } from '../data/order.repository';
import { CartService } from '../../../core/cart.service';
import { CustomerInfo, CreateOrderPayload, OrderConfirmation, OrderItemPayload } from '../domain/order.model';

export type OrderStatus = 'idle' | 'submitting' | 'success' | 'error';

@Injectable({
  providedIn: 'root'
})
export class CheckoutStore {
  private repository = inject(OrderRepository);
  private cartService = inject(CartService);

  readonly orderStatus = signal<OrderStatus>('idle');
  readonly isSubmitting = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly orderConfirmation = signal<OrderConfirmation | null>(null);

  readonly isSuccess = computed(() => this.orderStatus() === 'success');
  readonly isError = computed(() => this.orderStatus() === 'error');

  submitOrder(customer: CustomerInfo): Observable<OrderConfirmation> {
    if (this.isSubmitting()) {
      return throwError(() => new Error('Submission already in progress'));
    }

    const cartItems = this.cartService.cartItems();
    if (!cartItems || cartItems.length === 0) {
      this.errorMessage.set('El carrito está vacío. Agrega productos antes de realizar el pedido.');
      this.orderStatus.set('error');
      return throwError(() => new Error('Cannot submit order with an empty cart'));
    }
    const items: OrderItemPayload[] = cartItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const totalAmount = this.cartService.totalAmount();
    const payload: CreateOrderPayload = {
      items,
      customer,
      totalAmount
    };

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.orderStatus.set('submitting');

    const obs$ = this.repository.createOrder(payload).pipe(
      tap({
        next: (confirmation) => {
          this.orderConfirmation.set(confirmation);
          this.orderStatus.set('success');
          this.isSubmitting.set(false);
          this.cartService.clearCart();
        },
        error: (err) => {
          const msg = err?.error?.message || err?.message || 'Order submission failed';
          this.errorMessage.set(msg);
          this.orderStatus.set('error');
          this.isSubmitting.set(false);
        }
      })
    );

    obs$.subscribe({ error: () => {} });

    return obs$;
  }

  resetCheckout(): void {
    this.orderStatus.set('idle');
    this.isSubmitting.set(false);
    this.errorMessage.set(null);
    this.orderConfirmation.set(null);
  }
}
