import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteGuest as deletGuestApi } from '../../services/apiGuests';

export default function useDeleteGuest() {
  const queryClient = useQueryClient();
  const { isLoading: isDeleting, mutate: deleteGuest } = useMutation({
    mutationFn: deletGuestApi,
    onSuccess: () => {
      toast.success('cabins successfuly deleted ');

      queryClient.invalidateQueries({
        queryKey: ['guests'],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return {isDeleting, deleteGuest}
}
