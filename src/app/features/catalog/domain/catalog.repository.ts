import { Observable } from "rxjs";
import { Product } from "./product.model";

export abstract class CatalogRepository {
  abstract getProducts(): Observable<Product[]>;
  abstract getProductById(id: string): Observable<Product | undefined>;
  abstract getCategories(): Observable<string[]>;
}
