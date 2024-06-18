import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { login as loginApi } from '../../services/apiAuth';

function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient()

  const { isLoading, mutate: login } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (user) => {
        queryClient.setQueryData(['user'], user.user)
      navigate('/dashboard', { replace: true });
    },
    onError: (err) => {
      console.log('ERROR', err)
      toast.error('email or password wrong')
    }
  });

  return { isLoading, login };
}

export default useLogin;
