export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'https://api.medingen.in/v1',
  timeout: 30000,
  retryCount: 3,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};
