import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrderData } from '@/types/api';
import { useOrder as useOrderHook } from '@/hooks/api/useOrder';
import { useAuthContext} from './AuthContext';

type OrderContextType = {
  orders: OrderData[];
  currentOrder: OrderData | null;
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<OrderData[]>;
  fetchOrder: (orderId: string) => Promise<OrderData>;
  createOrder: () => Promise<OrderData>;
  cancelOrder: (orderId: string) => Promise<OrderData>;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { user } = useAuthContext();
  const {
    orders,
    currentOrder,
    isLoading,
    error,
    fetchOrders,
    fetchOrder,
    createOrder,
    cancelOrder
  } = useOrderHook();

  // Fetch user's orders when authenticated
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  const value = {
    orders,
    currentOrder,
    isLoading,
    error,
    fetchOrders,
    fetchOrder,
    createOrder,
    cancelOrder
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};