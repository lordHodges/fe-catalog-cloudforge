export interface Address {
  street_name: string;
  street_number: string;
  department?: string;
  comuna: string;
  region: string;
}

export interface Payer {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: Address;
}

export interface CheckoutItem {
  id: string;
  quantity: number;
}

export interface CreateCheckoutPayload {
  items: CheckoutItem[];
  payer: Payer;
}

export interface CheckoutResponse {
  init_point: string;
  order_id: string;
}
