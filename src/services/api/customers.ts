import { apiClient } from './client';
import type { UserProfile, CustomerAddress } from '@/types/customer';

export async function getProfileData(): Promise<UserProfile | null> {
  try {
    const response = await apiClient.get<UserProfile>('/customer/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return null;
  }
}

export async function getCustomerAddresses(): Promise<CustomerAddress[]> {
  try {
    const response = await apiClient.get<CustomerAddress[]>('/customer/addresses');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching customer addresses:', error);
    return [];
  }
}
