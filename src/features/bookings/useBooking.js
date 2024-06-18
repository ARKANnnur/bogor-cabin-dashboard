import { useQuery } from '@tanstack/react-query';
import { getBooking } from '../../services/apiBookings';
import { useParams } from 'react-router-dom';

function useBooking() {
  const { bookingId } = useParams();

  const {
    isLoading,
    data: booking = {},
  } = useQuery({
    queryKey: ['bookings', bookingId],
    queryFn: () => getBooking(bookingId),
    retry: false,
  });

  return { isLoading, booking };
}
export default useBooking;
