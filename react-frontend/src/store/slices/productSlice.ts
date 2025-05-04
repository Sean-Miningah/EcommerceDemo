/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productService } from '@/lib/api/productService';
import { ProductData, CategoryData, PaginatedResponse } from '@/types/api';

// Define filter types
export interface ProductFilters {
  page?: number;
  ordering?: string;
  categories?: string[];
  priceRange?: [number, number];
  search?: string;
}

interface ProductState {
  products: ProductData[];
  product: ProductData | null;
  categories: CategoryData[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  nextPage: string | null;
  previousPage: string | null;
  filters: ProductFilters;
  // Track if initial data is loaded to prevent repeated calls
  initialDataLoaded: boolean;
}

const initialState: ProductState = {
  products: [],
  product: null,
  categories: [],
  loading: false,
  error: null,
  totalCount: 0,
  nextPage: null,
  previousPage: null,
  filters: {
    page: 1,
    ordering: '',
    categories: [],
    priceRange: [0, 1000]
  },
  initialDataLoaded: false
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters: ProductFilters, { rejectWithValue }) => {
    try {
      // Extract parameters from filters
      const { page = 1, ordering, categories, priceRange, search } = filters;

      const response = await productService.getProducts(page, ordering, categories, priceRange, search);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: number, { rejectWithValue }) => {
    try {
      const product = await productService.getProductById(id);
      return product;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch product');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getCategories(1); // Always fetch first page of categories
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch categories');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductError(state) {
      state.error = null;
    },
    clearProduct(state) {
      state.product = null;
    },
    setProductFilters(state, action: PayloadAction<ProductFilters>) {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    setInitialDataLoaded(state, action: PayloadAction<boolean>) {
      state.initialDataLoaded = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<PaginatedResponse<ProductData>>) => {
        state.products = action.payload.results;
        state.totalCount = action.payload.count;
        state.nextPage = action.payload.next;
        state.previousPage = action.payload.previous;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch product by id
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<ProductData>) => {
        state.product = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<PaginatedResponse<CategoryData>>) => {
        state.categories = action.payload.results;
        state.loading = false;
        state.initialDataLoaded = true; // Mark categories as loaded
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearProductError,
  clearProduct,
  setProductFilters,
  setInitialDataLoaded
} = productSlice.actions;

export default productSlice.reducer;