export interface AuthToken {
  token: string;
  expiresAt?: string;
}

export interface UserSession {
  customer_id: string | number;
  phone_number: string;
  jwt_token: string;
  isLoggedIn: boolean;
}

export interface LoginPayload {
  phone_number: string;
  password?: string;
  otp?: string;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  phone_number: string;
  email?: string;
  password?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: UserSession;
}

export interface UserProfile {
  customer_id: string | number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  addresses?: Array<{
    id: string | number;
    address1: string;
    city: string;
    state: string;
    pincode: string;
  }>;
}
