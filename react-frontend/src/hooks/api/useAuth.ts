import apiClient from '@/lib/api/client';
import {
  LoginCredentials,
  SignupCredentials,
  AuthResponse,
} from '@/types/api';

export const useAuth = () => {
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login/', credentials);
      // Store token in localStorage
      localStorage.setItem('token', response.data.access);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to login. Please try again.';
      throw new Error(errorMessage);
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register/', credentials);
      // Store token in localStorage
      localStorage.setItem('token', response.data.access);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail ||
        Object.values(err.response?.data || {}).flat().join(', ') ||
        'Failed to create account. Please try again.';
      throw new Error(errorMessage);
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
  };

  const requestPasswordReset = async (email: string): Promise<void> => {
    // Implementation
  };

  const resetPassword = async (token: string, uidb64: string, newPassword: string): Promise<void> => {
    // Implementation
  };

  const getCurrentUser = async (): Promise<AuthResponse['user'] | null> => {
    const token = localStorage.getItem('token');

    if (!token) {
      return null;
    }

    try {
      const response = await apiClient.get<{ user: AuthResponse['user'] }>('/auth/me/');
      console.log("Response from getCurrentUser:", response.data);
      return response.data.user;
    } catch (err) {
      localStorage.removeItem('token');
      return null;
    }
  };

  return {
    login,
    signup,
    logout,
    requestPasswordReset,
    resetPassword,
    getCurrentUser,
  };
};