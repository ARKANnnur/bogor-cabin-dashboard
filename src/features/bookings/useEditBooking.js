import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createEditBooking } from '../../services/apiBookings';

export function useEditBooking() {
  const queryClient = useQueryClient();

  const { isLoading: isEditing, mutate: editBooking } = useMutation({
    mutationFn: ({ newBookingEdit, id }) => createEditBooking(newBookingEdit, id),
    onSuccess: () => {
      toast.success('bookings successfuly Edited ');
      queryClient.invalidateQueries({
        queryKey: ['bookings'],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editBooking };
}
