import { useState, useCallback } from 'react';
import apiClient from '@/lib/api/client';
import { OrderData, PaginatedResponse } from '@/types/api';
import { useToast } from "@/hooks/ui/use-toast";

export const useOrder = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [currentOrder, setCurrentOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all orders for the current user
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<PaginatedResponse<OrderData>>('/orders/');
      setOrders(response.data.results);
      return response.data.results;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch orders. Please try again.';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch a single order by ID
  const fetchOrder = useCallback(async (orderId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<OrderData>(`/orders/${orderId}/`);
      setCurrentOrder(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch order details. Please try again.';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Create a new order from the cart
  const createOrder = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<OrderData>('/orders/checkout/');
      setCurrentOrder(response.data);

      toast({
        title: "Order created",
        description: `Order #${response.data.id} has been created successfully!`,
      });

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to create order. Please try again.';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Cancel an order (only for pending orders)
  const cancelOrder = useCallback(async (orderId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.patch<OrderData>(`/orders/${orderId}/`, {
        status: 'cancelled'
      });

      // Update the orders list and current order
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? response.data : order
        )
      );

      if (currentOrder && currentOrder.id === orderId) {
        setCurrentOrder(response.data);
      }

      toast({
        title: "Order cancelled",
        description: `Order #${orderId} has been cancelled.`,
      });

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to cancel order. Please try again.';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentOrder, toast]);

  return {
    orders,
    currentOrder,
    isLoading,
    error,
    fetchOrders,
    fetchOrder,
    createOrder,
    cancelOrder
  };
};