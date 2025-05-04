import api from './axioConfig';
import type { PaginatedResponse, OrderData } from '@/types/api'

export const orderService = {
  getOrders: async (page = 1): Promise<PaginatedResponse<OrderData>> => {
    const response = await api.get('/orders/', { params: { page } });
    return response.data;
  },

  getOrderById: async (id: number): Promise<OrderData> => {
    const response = await api.get(`/orders/${id}/`);
    return response.data;
  },

  createOrder: async (orderData: Partial<OrderData>): Promise<OrderData> => {
    const response = await api.post('/orders/', orderData);
    return response.data;
  },

  checkout: async (): Promise<OrderData> => {
    const response = await api.post('/orders/checkout/', {});
    return response.data;
  },

  updateOrderStatus: async (id: number, status: OrderData['status']): Promise<OrderData> => {
    const response = await api.patch(`/orders/${id}/`, { status });
    return response.data;
  },
};