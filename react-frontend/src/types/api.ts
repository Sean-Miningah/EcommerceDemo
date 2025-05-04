export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
  password2: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'ADMIN' | 'CUSTOMER';
  phone_number?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: string;
    username: string;
    email: string;
    is_admin: boolean;
  };
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  password: string;
  token: string;
  uidb64: string;
}

export interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  category_name: string;
  image: string | null;
  created_at: string;
}

export interface CategoryData {
  id: string;
  name: string;
}

export interface CartItemData {
  id: string;
  product: string;
  product_detail: ProductData;
  quantity: number;
  total_price: number;
}

export interface CartSummary {
  items: CartItemData[];
  total: number;
  count: number;
}

export interface OrderItemData {
  id: string;
  product: string;
  product_detail: ProductData;
  quantity: number;
  price: number;
  total_price: number;
}

export interface OrderData {
  id: string;
  user: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  items: OrderItemData[];
  created_at: string;
  updated_at: string;
}