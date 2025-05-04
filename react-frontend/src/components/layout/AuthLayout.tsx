import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/api/useAuth';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { fetchCurrentUser } = useAuth();
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  useEffect(() => {
    if (!hasAttemptedFetch) {
      const token = localStorage.getItem('access_token');

      if (token) {
        fetchCurrentUser().finally(() => {
          setHasAttemptedFetch(true);
        });
      } else {
        setHasAttemptedFetch(true);
      }
    }
  }, [fetchCurrentUser, hasAttemptedFetch]);

  return <>{children}</>;
}