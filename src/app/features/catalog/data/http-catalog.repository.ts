import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { CatalogRepository } from "../domain/catalog.repository";
import { Product } from "../domain/product.model";
import { MOCK_PRODUCTS } from "./mock-catalog.repository";

@Injectable({
  providedIn: "root",
})
export class HttpCatalogRepository extends CatalogRepository {
  private http = inject(HttpClient);

  getApiUrl(): string {
    if (typeof window !== "undefined" && window?.location?.hostname) {
      const hostname = window.location.hostname;
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return "/api/products";
      }
    }
    return "https://us-central1-cloudforge-market-9dbcf.cloudfunctions.net/products";
  }

  getProducts(page?: number, limit?: number): Observable<Product[]> {
    const url = this.getApiUrl();
    let params = new HttpParams();
    if (page !== undefined) {
      params = params.set("page", page.toString());
    }
    if (limit !== undefined) {
      params = params.set("limit", limit.toString());
    }

    return this.http
      .get<Product[] | { items: Product[] }>(url, { params })
      .pipe(
        map((res) => {
          if (Array.isArray(res)) {
            return res;
          } else if (
            res &&
            typeof res === "object" &&
            "items" in res &&
            Array.isArray(res.items)
          ) {
            return res.items;
          }
          return [];
        }),
        catchError(() => {
          let items = [...MOCK_PRODUCTS];
          if (page !== undefined && limit !== undefined) {
            const startIndex = (page - 1) * limit;
            items = items.slice(startIndex, startIndex + limit);
          }
          return of(items);
        }),
      );
  }

  getProductById(id: string): Observable<Product | undefined> {
    const url = `${this.getApiUrl()}/${id}`;
    return this.http.get<Product>(url).pipe(
      catchError(() => {
        const product = MOCK_PRODUCTS.find((p) => p.id === id);
        return of(product ? { ...product } : undefined);
      }),
    );
  }

  getCategories(): Observable<string[]> {
    const url = `${this.getApiUrl()}/categories`;
    return this.http.get<string[]>(url).pipe(
      catchError(() => {
        const categories = Array.from(
          new Set(MOCK_PRODUCTS.map((p) => p.category)),
        );
        return of(["Todas", ...categories]);
      }),
    );
  }
}
