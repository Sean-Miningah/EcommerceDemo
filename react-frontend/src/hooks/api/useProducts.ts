import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api/client';
import {
  ProductData,
  CategoryData,
  PaginatedResponse
} from '@/types/api';

type SortOption = "name_asc" | "name_desc" | "price_asc" | "price_desc";

interface UseProductsOptions {
  initialPage?: number;
  initialCategories?: string[];
  initialPriceRange?: { min: number; max: number };
  initialSortOption?: SortOption;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(options.initialPage || 1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(options.initialCategories || []);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>(
    options.initialPriceRange || { min: 0, max: 1000 }
  );
  const [sortOption, setSortOption] = useState<SortOption>(options.initialSortOption || "name_asc");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productsPerPage = 10;

  const getSortParam = (option: SortOption): string => {
    switch (option) {
      case "name_asc": return "name";
      case "name_desc": return "-name";
      case "price_asc": return "price";
      case "price_desc": return "-price";
      default: return "name";
    }
  };

  // Build query parameters for API request
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();

    // Pagination
    params.append('page', currentPage.toString());

    // Sorting
    params.append('ordering', getSortParam(sortOption));

    // Category filtering
    if (selectedCategories.length > 0) {
      selectedCategories.forEach(category => {
        params.append('category', category);
      });
    }

    // Price range filtering
    if (priceRange.min > 0) {
      params.append('min_price', priceRange.min.toString());
    }

    params.append('max_price', priceRange.max.toString());

    return params.toString();
  }, [currentPage, sortOption, selectedCategories, priceRange]);

  // Fetch products from the API
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = buildQueryParams();
      const response = await apiClient.get<PaginatedResponse<ProductData>>(
        `/products/?${queryParams}`
      );

      setFilteredProducts(response.data.results);
      setTotalCount(response.data.count);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch products. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [buildQueryParams]);

  // Fetch all products (used for initial data and potentially for client-side operations)
  const fetchAllProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<PaginatedResponse<ProductData>>('/products/?limit=1000');
      setProducts(response.data.results);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch all products. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch categories from the API
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<PaginatedResponse<CategoryData>>('/products/categories/');
      setCategories(response.data.results);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch categories. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([fetchCategories(), fetchAllProducts()]);
    };

    initializeData();
  }, [fetchCategories, fetchAllProducts]);

  // Fetch filtered products whenever filters or pagination change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, currentPage, sortOption, selectedCategories, priceRange]);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / productsPerPage);

  return {
    products,
    categories,
    filteredProducts,
    currentPage,
    totalPages,
    isLoading,
    error,
    setCurrentPage,
    setSelectedCategories,
    setPriceRange: (min: number, max: number) => setPriceRange({ min, max }),
    setSortOption,
    selectedCategories,
    priceRange,
    sortOption,
    productsPerPage,
    totalCount,
    refetch: fetchProducts
  };
};