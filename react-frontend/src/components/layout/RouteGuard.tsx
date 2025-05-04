import { useNavigate } from "react-router";
import { useAuth } from '@/hooks/api/useAuth';

interface RouteGuardProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function RouteGuard({ children, adminOnly = false }: RouteGuardProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate()

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // return <Navigate to="/login" />;
    navigate('/login')
  }

  if (adminOnly && user?.role !== "ADMIN") {
    // return <Navigate to="/" />;
    navigate('/')
  }

  return <>{children}</>;
}