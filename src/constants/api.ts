export const API_ENDPOINTS = {
  PRODUCTS: {
    LIST: '/products',
    BY_SLUG: (slug: string) => `/products/${slug}`,
    BY_ID: (id: string | number) => `/products/id/${id}`,
    SEARCH: '/products/search',
  },
  CATEGORIES: {
    MAIN: '/categories/main',
    SUB: (mainCategory: string) => `/categories/sub/${mainCategory}`,
    PRODUCTS: (subCategory: string) => `/categories/products/${subCategory}`,
  },
  SALTS: {
    BY_SLUG: (slug: string) => `/salts/${slug}`,
  },
  BLOGS: {
    LIST: '/blogs',
    BY_SLUG: (slug: string) => `/blogs/${slug}`,
  },
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    REMOVE: '/cart/remove',
    UPDATE: '/cart/update',
    CLEAR: '/cart/clear',
  },
  ORDERS: {
    LIST: '/orders',
    DETAILS: (id: string) => `/orders/${id}`,
    PLACE: '/orders/place',
    INVOICE: (id: string) => `/orders/${id}/invoice`,
  },
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    OTP_SEND: '/auth/send-otp',
    OTP_VERIFY: '/auth/verify-otp',
    LOGOUT: '/auth/logout',
  },
  CUSTOMER: {
    PROFILE: '/customer/profile',
    ADDRESSES: '/customer/addresses',
    UPDATE_PASSWORD: '/customer/change-password',
  },
} as const;
