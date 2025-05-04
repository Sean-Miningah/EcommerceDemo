import api from './axioConfig';
import type {PaginatedResponse, CartItemData } from "@/types/api"

export const cartService = {
  getCartItems: async (page = 1): Promise<PaginatedResponse<CartItemData>> => {
    const response = await api.get('/cart/', { params: { page } });
    return response.data;
  },

  getCartSummary: async (): Promise<PaginatedResponse<CartItemData>> => {
    const response = await api.get('/cart/summary/');
    return response.data;
  },

  addToCart: async (productId: number, quantity = 1): Promise<CartItemData> => {
    const response = await api.post('/cart/', { product: productId, quantity });
    return response.data;
  },

  updateCartItem: async (id: number, quantity: number): Promise<CartItemData> => {
    const response = await api.patch(`/cart/${id}/`, { quantity });
    return response.data;
  },

  removeCartItem: async (id: number): Promise<void> => {
    await api.delete(`/cart/${id}/`);
  },

  clearCart: async (): Promise<void> => {
    await api.delete('/cart/clear/');
  },
};