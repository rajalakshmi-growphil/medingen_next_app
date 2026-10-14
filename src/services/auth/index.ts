import { apiClient } from '../api/client';
import type { LoginPayload, RegisterPayload, AuthResponse, UserProfile } from '@/types/auth';

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>('/auth/login', payload);
  return res.data;
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>('/auth/register', payload);
  return res.data;
}

export async function getProfile(): Promise<UserProfile> {
  const res = await apiClient.get<UserProfile>('/auth/profile');
  return res.data;
}
