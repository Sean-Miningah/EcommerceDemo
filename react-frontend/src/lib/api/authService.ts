import api from './axioConfig';
import { LoginCredentials, AuthTokens, SignupCredentials, User, PasswordResetRequest } from "@/types/api"

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },

  register: async (userData: SignupCredentials): Promise<User> => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me/');
    return response.data;
  },

  changePassword: async (passwordData: PasswordResetRequest): Promise<void> => {
    await api.put('/auth/change-password/', passwordData);
  },

  resetPassword: async (email: string): Promise<void> => {
    await api.post('/auth/reset-password/', { email });
  },

  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    const response = await api.post('/auth/token/refresh/', { refresh: refreshToken });
    return response.data;
  },
};