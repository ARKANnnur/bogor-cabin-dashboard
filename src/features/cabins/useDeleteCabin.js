import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCabin as deletCabinApi } from '../../services/apiCabins';
import toast from 'react-hot-toast';

export default function useDeleteCabin() {
  const queryClient = useQueryClient();
  const { isLoading: isDeleting, mutate: deleteCabin } = useMutation({
    mutationFn: deletCabinApi,
    onSuccess: () => {
      toast.success('cabins successfuly deleted ');

      queryClient.invalidateQueries({
        queryKey: ['cabins'],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return {isDeleting, deleteCabin}
}
