import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../../services/apiAuth';

function useUser() {
  const { isLoading, data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
  });

  const guestUser = user?.email === 'guest@gmail.com';

  return {
    isLoading,
    user,
    isAuthenticated: user?.role === 'authenticated',
    guestUser,
  };
}

export default useUser;
