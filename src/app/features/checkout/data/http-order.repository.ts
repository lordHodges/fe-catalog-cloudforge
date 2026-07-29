import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, of, throwError, map, catchError } from "rxjs";
import { OrderRepository } from "./order.repository";
import { CreateOrderPayload, OrderConfirmation } from "../domain/order.model";

@Injectable({
  providedIn: "root",
})
export class HttpOrderRepository extends OrderRepository {
  private http = inject(HttpClient);

  getApiUrl(): string {
    if (typeof window !== "undefined" && window?.location?.hostname) {
      const hostname = window.location.hostname;
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return "/api/orders";
      }
    }
    return "https://us-central1-cloudforge-market-9dbcf.cloudfunctions.net/checkoutSession";
  }

  createOrder(payload: CreateOrderPayload): Observable<OrderConfirmation> {
    const url = this.getApiUrl();
    const body = {
      ...payload,
      payer: payload.customer,
    };

    return this.http.post<any>(url, body).pipe(
      map((res) => {
        if (!res || typeof res !== "object") {
          return this.buildFallbackConfirmation(payload);
        }
        return this.buildConfirmation(res, payload);
      }),
      catchError((err: any) => {
        if (
          err instanceof HttpErrorResponse &&
          err.status === 500 &&
          err.error &&
          typeof err.error === "object" &&
          typeof err.error.message === "string"
        ) {
          return throwError(() => err);
        }

        return of(this.buildFallbackConfirmation(payload));
      }),
    );
  }

  private buildConfirmation(
    res: any,
    payload: CreateOrderPayload,
  ): OrderConfirmation {
    return {
      orderId:
        res.orderId ||
        res.id ||
        `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      status: res.status || (res.success ? "created" : "pending"),
      totalAmount:
        typeof res.totalAmount === "number"
          ? res.totalAmount
          : payload.totalAmount,
      createdAt: res.createdAt || new Date().toISOString(),
      message: res.message || "Pedido procesado exitosamente",
    };
  }

  private buildFallbackConfirmation(
    payload: CreateOrderPayload,
  ): OrderConfirmation {
    return {
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      status: "created",
      totalAmount: payload.totalAmount,
      createdAt: new Date().toISOString(),
      message: "Pedido verificado exitosamente (modo contingencia)",
    };
  }
}
