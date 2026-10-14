export interface OrderItem {
  name: string;
  salt?: string;
  quantity: number;
  price_per_unit: number;
  total_price: number;
}

export interface OrderAddress {
  name: string;
  line1: string;
  line2?: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface OrderSummary {
  totalAmount: number;
  totalMRP: number;
  totalSavings: number;
  total_selling_price: number;
  total_shipping_charge: number;
  total_cod_charge: number;
}

export interface Order {
  cart_id: number | string;
  order_id?: string;
  custom_order_id?: string;
  items?: OrderItem[];
  address?: OrderAddress;
  orderSummary?: OrderSummary;
  payment_done_date?: string;
  cart_created_date?: string;
  deliveryAddress?: Record<string, unknown>;
  products?: Record<string, unknown>[];
  cart?: Record<string, unknown>[];
  shipping_charge?: number;
}
