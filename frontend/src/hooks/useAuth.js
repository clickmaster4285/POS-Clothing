import { useNavigate } from "react-router-dom";
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { authAPI } from '../api/authApi';
import { setAuthErrorRedirector } from '../api/axios';
import { useCallback, useMemo, useEffect } from 'react';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: userData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['me'],
    queryFn: authAPI.getMe,
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
    enabled: !!localStorage.getItem('token'),
  });

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.data.token);
      // Force immediate refetch
      queryClient.invalidateQueries({ queryKey: ['me'] });
      refetch();
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  const user = useMemo(() => userData?.data, [userData]);
  const isAuthenticated = useMemo(() => !!user, [user]);

  const logout = useCallback((redirectPath = '/login') => {
    localStorage.removeItem('token');
    queryClient.clear();
    navigate(redirectPath, { replace: true });
  }, [navigate, queryClient]);

  // Set the global error handler for the API interceptor
  useEffect(() => {
    setAuthErrorRedirector((status) => {
      if (status === 401) {
        logout();
      } else if (status === 403 && window.location.pathname !== '/') {
        navigate('/', { replace: true });
      }
    });
  }, [logout, navigate]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isError,
    error,
    logout,
    loginMutation,
    refetch,
  };
};