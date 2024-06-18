import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { signup as signupApi } from '../../services/apiAuth';

function useSignup() {
  const { isLoading, mutate: signup } = useMutation({
    mutationFn: ({ fullName, email, password }) =>
      signupApi({ fullName, email, password }),
    onSuccess: (user) => {
      console.log(user);
      toast.success(
        'Account succesfully created! Please verify the new account from users email addres'
      );
    },
    onError: (err) => {
      console.log('ERROR', err);
      toast.error(err.message);
    },
  });

  return { isLoading, signup };
}

export default useSignup;
