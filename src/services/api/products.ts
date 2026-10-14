import { apiClient } from './client';
import type { Product } from '@/types/product';
import type { PaginatedResult } from '@/types/api';

export async function searchProducts(query: string, page = 1): Promise<PaginatedResult<Product>> {
  try {
    const response = await apiClient.get<PaginatedResult<Product>>(`/products/search?q=${encodeURIComponent(query)}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    return { results: [], total_pages: 0, total_results: 0 };
  }
}

export async function getProductDetails(slug: string): Promise<Product | null> {
  try {
    const response = await apiClient.get<Product>(`/products/details/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
}

export async function requestProduct(productId: string | number, customerId: string | number, notes: string | null, action: string, status: string) {
  try {
    const response = await apiClient.post('/products/request', {
      product_id: productId,
      customer_id: customerId,
      notes,
      action,
      status,
    });
    return response.data;
  } catch (error) {
    console.error('Error requesting product:', error);
    return null;
  }
}
