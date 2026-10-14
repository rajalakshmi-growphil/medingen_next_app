import { apiClient } from './client';
import type { Category } from '@/types/category';
import type { Product } from '@/types/product';
import type { PaginatedResult } from '@/types/api';

export async function getMainCategories(): Promise<Category[]> {
  try {
    const response = await apiClient.get<Category[]>('/categories/main');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching main categories:', error);
    return [];
  }
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const response = await apiClient.get<Category[]>('/categories/all');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching all categories:', error);
    return [];
  }
}

export async function getProductsByCategory(options: {
  categoryName: string;
  page?: number;
  sortBy?: string;
  perPage?: number;
  composition?: string;
  subCategories?: string[];
  consumeType?: string | null;
}): Promise<PaginatedResult<Product>> {
  try {
    const response = await apiClient.post<PaginatedResult<Product>>('/categories/products', options);
    return response.data;
  } catch (error) {
    console.error('Error fetching category products:', error);
    return { results: [], total_pages: 0, total_results: 0 };
  }
}
