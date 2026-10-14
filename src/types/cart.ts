import { Product } from './product';

export interface CartItem extends Product {
  id: number | string;
  quantity: number;
}

export interface CartState {
  itemCount: number;
  cartItems: CartItem[];
  cartId: string | number | null;
}
