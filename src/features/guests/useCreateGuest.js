import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createEditGuest } from '../../services/apiGuests';

export default function useCreateGuest() {
  const queryClient = useQueryClient();
  const { isLoading: isCreating, mutate: createGuest } = useMutation({
    mutationFn: createEditGuest,
    onSuccess: () => {
      toast.success('Guest successfuly Created ');
      queryClient.invalidateQueries({
        queryKey: ['guests'],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createGuest };
}
