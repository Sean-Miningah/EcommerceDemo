import  api  from './axioConfig';
import { ProductData, CategoryData, PaginatedResponse } from '@/types/api';

export const productService = {
  /**
   * Get products with optional filtering
   */
  async getProducts(
    page = 1,
    ordering?: string,
    categories?: string[],
    priceRange?: [number, number],
    search?: string
  ): Promise<PaginatedResponse<ProductData>> {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('page', page.toString());

    if (ordering) {
      params.append('ordering', ordering);
    }

    if (categories && categories.length > 0) {
      categories.forEach(cat => {
        params.append('category', cat);
      });
    }

    if (priceRange) {
      params.append('min_price', priceRange[0].toString());
      params.append('max_price', priceRange[1].toString());
    }

    if (search) {
      params.append('search', search);
    }

    const response = await api.get(`/products/?${params.toString()}`);
    return response.data;
  },

  /**
   * Get product by ID
   */
  async getProductById(id: number): Promise<ProductData> {
    const response = await api.get(`/products/${id}/`);
    return response.data;
  },

  /**
   * Get product categories
   */
  async getCategories(page = 1): Promise<PaginatedResponse<CategoryData>> {
    const response = await api.get(`/products/categories/?page=${page}`);
    return response.data;
  }
};