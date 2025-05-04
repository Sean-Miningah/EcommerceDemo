import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store';
import {
  fetchCartItems,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartAction,
  clearCartError,
} from '@/store/slices/cartSlice';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error, totalItems } = useSelector(
    (state: RootState) => state.cart
  );

  const getCartItems = async () => {
    try {
      await dispatch(fetchCartItems()).unwrap();
      return true;
    } catch (error) {
      console.log("error get cart items", error)
      return false;
    }
  };

  const handleAddToCart = async (productId: number, quantity = 1) => {
    try {
      await dispatch(addToCart({ productId, quantity })).unwrap();
      return true;
    } catch (error) {
      console.log("error adding to cart", error)
      return false;
    }
  };

  const handleUpdateCartItem = async (id: number, quantity: number) => {
    try {
      await dispatch(updateCartItem({ id, quantity })).unwrap();
      return true;
    } catch (error) {
      console.log("error udpating cart item", error)
      return false;
    }
  };

  const handleRemoveCartItem = async (id: number) => {
    try {
      await dispatch(removeCartItem(id)).unwrap();
      return true;
    } catch (error) {
      console.log("error removing cart item", error)
      return false;
    }
  };

  const handleClearCart = async () => {
    try {
      await dispatch(clearCartAction()).unwrap();
      return true;
    } catch (error) {
      console.log("error clearing cart", error)
      return false;
    }
  };

  const handleClearError = () => {
    dispatch(clearCartError());
  };

  // Calculate cart total
  const cartTotal = items.reduce((total, item) => {
    return total + item.total_price;
  }, 0).toFixed(2);

  return {
    cartItems: items,
    cartTotal,
    loading,
    error,
    totalItems,
    getCartItems,
    addToCart: handleAddToCart,
    updateCartItem: handleUpdateCartItem,
    removeFromCart: handleRemoveCartItem,
    clearCart: handleClearCart,
    clearError: handleClearError,
  };
};