import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createEditBooking } from '../../services/apiBookings';

export default function useCreateBooking() {
  const queryClient = useQueryClient();
  const { isLoading: isCreating, mutate: createBooking } = useMutation({
    mutationFn: createEditBooking,
    onSuccess: () => {
      toast.success('bookings successfuly Created ');
      queryClient.invalidateQueries({
        queryKey: ['bookings'],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createBooking };
}
