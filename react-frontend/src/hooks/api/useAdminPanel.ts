import { useState, useCallback } from 'react';
import apiClient from '@/lib/api/client';
import {
  ProductData,
  OrderData,
  PaginatedResponse
} from '@/lib/api/types';
import { useToast } from '@/hooks/ui/use-toast';

export const useAdminPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Product management functions
  const createProduct = useCallback(async (productData: Omit<ProductData, 'id' | 'created_at'>) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      // Add all product data to form data
      Object.entries(productData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'image' && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const response = await apiClient.post<ProductData>('/products/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: "Product created",
        description: `${response.data.name} has been added to your inventory.`,
      });

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to create product. Please try again.';
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

  const updateProduct = useCallback(async (productId: string, productData: Partial<ProductData>) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      // Add all product data to form data
      Object.entries(productData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'image' && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const response = await apiClient.patch<ProductData>(`/products/${productId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: "Product updated",
        description: `${response.data.name} has been updated.`,
      });

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to update product. Please try again.';
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

  const deleteProduct = useCallback(async (productId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.delete(`/products/${productId}/`);

      toast({
        title: "Product deleted",
        description: "The product has been removed from your inventory.",
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete product. Please try again.';
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

  // Order management functions
  const getAllOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<PaginatedResponse<OrderData>>('/orders/');
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

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderData['status']) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.patch<OrderData>(`/orders/${orderId}/`, {
        status
      });

      toast({
        title: "Order updated",
        description: `Order #${orderId} status changed to ${status}.`,
      });

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to update order status. Please try again.';
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

  return {
    isLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllOrders,
    updateOrderStatus
  };
};
