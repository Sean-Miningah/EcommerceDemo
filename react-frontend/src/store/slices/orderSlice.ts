import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderService } from '@/lib/api/orderService';
import { OrderData, PaginatedResponse } from '@/types/api';

interface OrderState {
  orders: OrderData[];
  order: OrderData | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
}

const initialState: OrderState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  totalCount: 0,
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrders(page);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id: number, { rejectWithValue }) => {
    try {
      const order = await orderService.getOrderById(id);
      return order;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch order');
    }
  }
);

export const checkout = createAsyncThunk(
  'orders/checkout',
  async (_, { rejectWithValue }) => {
    try {
      const order = await orderService.checkout();
      return order;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Checkout failed');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status }: { id: number, status: OrderData['status'] }, { rejectWithValue }) => {
    try {
      const order = await orderService.updateOrderStatus(id, status);
      return order;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update order status');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError(state) {
      state.error = null;
    },
    clearOrder(state) {
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<PaginatedResponse<OrderData>>) => {
        state.orders = action.payload.results;
        state.totalCount = action.payload.count;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch order by id
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<OrderData>) => {
        state.order = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Checkout
      .addCase(checkout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkout.fulfilled, (state, action: PayloadAction<OrderData>) => {
        state.order = action.payload;
        state.orders.unshift(action.payload);
        state.totalCount += 1;
        state.loading = false;
      })
      .addCase(checkout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<OrderData>) => {
        // Update the order in the orders array
        const index = state.orders.findIndex((order) => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }

        // Update current order if we're viewing it
        if (state.order && state.order.id === action.payload.id) {
          state.order = action.payload;
        }

        state.loading = false;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOrderError, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
