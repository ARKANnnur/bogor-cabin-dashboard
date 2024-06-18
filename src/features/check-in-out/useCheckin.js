import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBooking } from '../../services/apiBookings';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  const { isLoading: isCheckin, mutate: checkin } = useMutation({
    mutationFn: ({bookingId, breakfast}) =>
      updateBooking(bookingId, {
        status: 'checked-in',
        isPaid: true,
        ...breakfast
      }),
    onSuccess: (data) => {
      toast.success(`booking #${data.id} successfuly checked in `);
      queryClient.invalidateQueries({active: true});
      navigate('/bookings')
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCheckin, checkin };
}
