import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { cartService } from '@/lib/api/cartService';
import { CartItemData, PaginatedResponse } from '@/types/api';

interface CartState {
  items: CartItemData[];
  loading: boolean;
  error: string | null;
  totalItems: number;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  totalItems: 0,
};

export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCartItems();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch cart items');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: number, quantity: number }, { rejectWithValue }) => {
    try {
      const cartItem = await cartService.addToCart(productId, quantity);
      return cartItem;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to add to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ id, quantity }: { id: number, quantity: number }, { rejectWithValue }) => {
    try {
      const cartItem = await cartService.updateCartItem(id, quantity);
      return cartItem;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update cart item');
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (id: number, { rejectWithValue }) => {
    try {
      await cartService.removeCartItem(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to remove cart item');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartService.clearCart();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart items
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action: PayloadAction<PaginatedResponse<CartItemData>>) => {
        state.items = action.payload.results;
        state.totalItems = action.payload.count;
        state.loading = false;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItemData>) => {
        // Check if the item is already in the cart
        const existingItemIndex = state.items.findIndex(
          (item) => item.product === action.payload.product
        );

        if (existingItemIndex >= 0) {
          state.items[existingItemIndex] = action.payload;
        } else {
          state.items.push(action.payload);
          state.totalItems += 1;
        }

        state.loading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<CartItemData>) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Remove cart item
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((item) => parseInt(item.id) !== action.payload);
        state.totalItems -= 1;
        state.loading = false;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalItems = 0;
        state.loading = false;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;