import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api/client';
import { CartItemData, CartSummary, ProductData } from '@/lib/api/types';
import { useAuth } from './useAuth';

export const useCart = () => {
  const [items, setItems] = useState<CartItemData[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getCurrentUser } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      setIsAuthenticated(!!user);
    };

    checkAuth();
  }, [getCurrentUser]);

  // Fetch cart from API
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<CartSummary>('/cart/summary/');
      setItems(response.data.items);
      setItemCount(response.data.count);
      setSubtotal(response.data.total);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch cart. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Initialize cart on authentication status change
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  // Add item to cart
  const addItem = async (product: ProductData, quantity = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post('/cart/', {
        product: product.id,
        quantity
      });
      fetchCart();
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to add item to cart. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeItem = async (productId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const cartItem = items.find(item => item.product === productId);
      if (cartItem) {
        await apiClient.delete(`/cart/${cartItem.id}/`);
        fetchCart();
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to remove item from cart. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeItem(productId);
    }

    setIsLoading(true);
    setError(null);

    try {
      const cartItem = items.find(item => item.product === productId);
      if (cartItem) {
        await apiClient.patch(`/cart/${cartItem.id}/`, {
          quantity
        });
        fetchCart();
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to update cart. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.delete('/cart/clear/');
      fetchCart();
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to clear cart. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    isLoading,
    error,
    refetch: fetchCart
  };
};