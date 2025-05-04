import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { RootState, useAppDispatch } from '@/store';
import {
  login,
  register,
  logout,
  getMe,
  changePassword,
  clearError as clearAuthError,
} from '@/store/slices/authSlice';
import { LoginCredentials, SignupCredentials, PasswordResetRequest } from '@/types/api';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await dispatch(login(credentials)).unwrap();
      navigate('/');
      return user;
    } catch (error) {
      console.log("Error when loggin in", error)
      return false;
    }
  };

  const handleRegister = async (userData: SignupCredentials) => {
    try {
      await dispatch(register(userData)).unwrap();
      navigate('/login');
      return user;
    } catch (error) {
      if (typeof error === 'string') {
        return false;
      } else return false;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleChangePassword = async (passwordData: PasswordResetRequest) => {
    try {
      await dispatch(changePassword(passwordData)).unwrap();
      return user;
    } catch (error) {
      if (typeof error === 'string') {
        return false;
      } else return false;
    }
  };

  const fetchCurrentUser = async () => {
    try {
      await dispatch(getMe()).unwrap();
      return user;
    } catch (error) {
      if (typeof error === 'string') {
        return false;
      } else return false;
    }
  };

  const handleClearError = () => {
    dispatch(clearAuthError());
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    changePassword: handleChangePassword,
    fetchCurrentUser,
    clearError: handleClearError,
  };
};