import { apiClient } from './client';
import type { Order } from '@/types/order';

export async function getOrders(page = 1, cartId?: string | number): Promise<{ orders: Order[] }> {
  try {
    const url = cartId ? `/orders?page=${page}&cart_id=${cartId}` : `/orders?page=${page}`;
    const response = await apiClient.get<{ orders: Order[] }>(url);
    return response.data || { orders: [] };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { orders: [] };
  }
}
