import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { OrderRepository } from './order.repository';
import { CreateOrderPayload, OrderConfirmation } from '../domain/order.model';

@Injectable({
  providedIn: 'root'
})
export class HttpOrderRepository extends OrderRepository {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/orders';

  createOrder(payload: CreateOrderPayload): Observable<OrderConfirmation> {
    return this.http.post<any>(this.apiUrl, payload).pipe(
      map(res => {
        return {
          orderId: res.orderId || res.id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
          status: res.status || (res.success ? 'created' : 'pending'),
          totalAmount: typeof res.totalAmount === 'number' ? res.totalAmount : payload.totalAmount,
          createdAt: res.createdAt || new Date().toISOString(),
          message: res.message
        };
      })
    );
  }
}
