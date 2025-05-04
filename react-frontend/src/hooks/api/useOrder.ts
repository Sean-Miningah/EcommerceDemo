import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store';
import {
  fetchOrders,
  fetchOrderById,
  checkout as checkoutAction,
  updateOrderStatus,
  clearOrderError,
  clearOrder,
} from '@/store/slices/orderSlice';
import { OrderData } from '@/types/api';

export const useOrders = () => {
  const dispatch = useAppDispatch();
  const { orders, order, loading, error, totalCount } = useSelector(
    (state: RootState) => state.orders
  );

  const getOrders = async (page = 1) => {
    try {
      await dispatch(fetchOrders(page)).unwrap();
      return true;
    } catch (error) {
      console.log("error getting orders cart", error)
      return false;
    }
  };

  const getOrderById = async (id: number) => {
    try {
      await dispatch(fetchOrderById(id)).unwrap();
      return true;
    } catch (error) {
      console.log("error getting order", error)
      return false;
    }
  };

  const handleCheckout = async () => {
    try {
      await dispatch(checkoutAction()).unwrap();
      return true;
    } catch (error) {
      console.log("error checking out", error)
      return false;
    }
  };

  const handleUpdateOrderStatus = async (id: number, status: OrderData['status']) => {
    try {
      await dispatch(updateOrderStatus({ id, status })).unwrap();
      return true;
    } catch (error) {
      console.log("error updating order status", error)
      return false;
    }
  };

  const handleClearError = () => {
    dispatch(clearOrderError());
  };

  const handleClearOrder = () => {
    dispatch(clearOrder());
  };

  return {
    orders,
    order,
    loading,
    error,
    totalCount,
    getOrders,
    getOrderById,
    checkout: handleCheckout,
    updateOrderStatus: handleUpdateOrderStatus,
    clearError: handleClearError,
    clearOrder: handleClearOrder,
  };
};