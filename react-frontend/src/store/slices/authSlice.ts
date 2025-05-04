import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '@/lib/api/authService';
import { User, LoginCredentials, SignupCredentials, PasswordResetRequest } from '@/types/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const tokens = await authService.login(credentials);
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      const user = await authService.getCurrentUser();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: SignupCredentials, { rejectWithValue }) => {
    try {
      const user = await authService.register(userData);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Registration failed');
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to get user info');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData: PasswordResetRequest, { rejectWithValue }) => {
    try {
      await authService.changePassword(passwordData);
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Password change failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get current user
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;