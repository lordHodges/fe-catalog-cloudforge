export interface CustomerInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
}

export interface OrderItemPayload {
  productId: string | number;
  quantity: number;
  price: number;
}

export interface CreateOrderPayload {
  items: OrderItemPayload[];
  customer: CustomerInfo;
  totalAmount: number;
}

export interface OrderConfirmation {
  orderId: string;
  status: string;
  totalAmount: number;
  createdAt?: string;
  message?: string;
}
