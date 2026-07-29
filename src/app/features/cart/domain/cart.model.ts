import { Product } from '../../catalog/domain/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}
