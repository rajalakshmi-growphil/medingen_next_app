import { apiClient } from './client';

export async function getCartData() {
  try {
    const response = await apiClient.get('/cart');
    return response;
  } catch (error) {
    console.error('Error fetching cart data:', error);
    throw error;
  }
}

export async function addToCart(productId: string | number, prescriptionId: string | number | null = null, quantity = 1, navigateHandler?: (path: string) => void) {
  try {
    const response = await apiClient.post('/cart/add', {
      product_id: productId,
      prescription_id: prescriptionId,
      quantity,
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cartUpdated'));
    }
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    if (navigateHandler && typeof window !== 'undefined') {
      navigateHandler('/login');
    }
    throw error;
  }
}
