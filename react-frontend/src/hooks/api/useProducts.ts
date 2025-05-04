import { useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { RootState, useAppDispatch } from '@/store';
import {
  fetchProducts,
  fetchProductById,
  fetchCategories,
  clearProductError,
  clearProduct,
  setProductFilters,
  // setInitialDataLoaded,
  ProductFilters
} from '@/store/slices/productSlice';

export const useProducts = () => {
  const dispatch = useAppDispatch();
  const {
    products,
    product,
    categories,
    loading,
    error,
    totalCount,
    nextPage,
    previousPage,
    filters: currentFilters,
    initialDataLoaded
  } = useSelector((state: RootState) => state.products);

  // Effect to fetch products when filters change
  useEffect(() => {
    if (currentFilters) {
      dispatch(fetchProducts(currentFilters));
    }
  }, [dispatch, currentFilters]);

  // Effect to load initial data (categories) only once
  useEffect(() => {
    if (!initialDataLoaded) {
      dispatch(fetchCategories());
    }
  }, [dispatch, initialDataLoaded]);

  // Set filters and let the effect trigger the API call
  const setFilters = useCallback((filters: ProductFilters) => {
    dispatch(setProductFilters(filters));
  }, [dispatch]);

  // Updated to use the setFilters function
  const getProducts = useCallback((page = 1, ordering?: string) => {
    setFilters({
      ...currentFilters,
      page,
      ...(ordering ? { ordering } : {})
    });
    return true;
  }, [setFilters, currentFilters]);

  // This function doesn't need to change
  const getProductById = useCallback(async (id: number) => {
    try {
      await dispatch(fetchProductById(id)).unwrap();
      return true;
    } catch (error) {
      console.log("Error getting product by id", error);
      return false;
    }
  }, [dispatch]);

  // Only force a categories fetch if required
  const getCategories = useCallback(async () => {
    if (!initialDataLoaded) {
      try {
        await dispatch(fetchCategories()).unwrap();
        return true;
      } catch (error) {
        console.log("Error getting categories", error);
        return false;
      }
    }
    return true;
  }, [dispatch, initialDataLoaded]);

  const handleClearError = useCallback(() => {
    dispatch(clearProductError());
  }, [dispatch]);

  const handleClearProduct = useCallback(() => {
    dispatch(clearProduct());
  }, [dispatch]);

  return {
    products,
    product,
    categories,
    loading,
    error,
    totalCount,
    nextPage,
    previousPage,
    currentFilters,
    getProducts,
    getProductById,
    getCategories,
    setFilters,
    clearError: handleClearError,
    clearProduct: handleClearProduct,
  };
};