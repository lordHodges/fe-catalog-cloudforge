import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  CreateOrderPayload,
  OrderConfirmation,
  PastOrder,
} from "../domain/order.model";

@Injectable()
export abstract class OrderRepository {
  abstract createOrder(
    payload: CreateOrderPayload,
  ): Observable<OrderConfirmation>;

  abstract getOrders(): Observable<PastOrder[]>;
}
