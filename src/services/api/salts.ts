import { apiClient } from './client';
import type { SaltComposition } from '@/types/salt';

export async function getSaltDetails(slug: string): Promise<SaltComposition | null> {
  try {
    const response = await apiClient.get<SaltComposition>(`/salts/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching salt details:', error);
    return null;
  }
}

export async function getRelatedCompositions(composition: string): Promise<SaltComposition[]> {
  try {
    const response = await apiClient.get<SaltComposition[]>(`/salts/related?composition=${encodeURIComponent(composition)}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching related compositions:', error);
    return [];
  }
}
