// src/contexts/ProductContext.tsx
import React, { createContext, useContext, useEffect } from "react";
import { useProducts as useProductsHook } from "@/hooks/api/useProducts";
import { ProductData, CategoryData } from "@/types/api";

type SortOption = "name_asc" | "name_desc" | "price_asc" | "price_desc";

type ProductContextType = {
  products: ProductData[];
  categories: CategoryData[];
  filteredProducts: ProductData[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  setCurrentPage: (page: number) => void;
  setSelectedCategories: (categories: string[]) => void;
  setPriceRange: (min: number, max: number) => void;
  setSortOption: (option: SortOption) => void;
  selectedCategories: string[];
  priceRange: { min: number; max: number };
  sortOption: SortOption;
  productsPerPage: number;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  // Use our API hook
  const {
    products,
    categories,
    filteredProducts,
    currentPage,
    totalPages,
    isLoading,
    error,
    setCurrentPage,
    setSelectedCategories,
    setPriceRange,
    setSortOption,
    selectedCategories,
    priceRange,
    sortOption,
    productsPerPage,
    refetch
  } = useProductsHook();

  // Optional: Synchronize URL with current filters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Check for category param
    const categoryParam = params.get('category');
    if (categoryParam && !selectedCategories.includes(categoryParam)) {
      setSelectedCategories([...selectedCategories, categoryParam]);
    }

    // You could add more URL param handling here if needed
  }, [selectedCategories, setSelectedCategories]);

  const value = {
    products,
    categories,
    filteredProducts,
    currentPage,
    totalPages,
    isLoading,
    error,
    setCurrentPage,
    setSelectedCategories,
    setPriceRange,
    setSortOption,
    selectedCategories,
    priceRange,
    sortOption,
    productsPerPage,
    refetch
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};