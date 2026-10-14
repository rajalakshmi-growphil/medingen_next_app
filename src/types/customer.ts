export interface UserProfile {
  customer_id?: number | string;
  name?: string;
  email?: string;
  phone?: string;
  phone_number?: string;
  isLoggedIn: boolean;
}

export interface CustomerAddress {
  address_id?: number | string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  pincode: string;
  state: string;
  phone_number: string;
  is_default?: boolean;
}
