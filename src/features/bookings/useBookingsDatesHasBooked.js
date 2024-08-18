import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getBookingsDatesHasBooked } from '../../services/apiBookings';

function useBookingsDatesHasBooked() {
  const queryClient = useQueryClient();

  const {
    isLoading: isBookingsDatesHasBooked,
    mutate: setBookingsDatesHasBooked,
    data: bookingsDatesHasBooked,
  } = useMutation({
    mutationFn: getBookingsDatesHasBooked,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bookingsSelectedDay'],
      });
    },
    onError: (err) => console.error(err.message),
    retry: false,
  });

  return {
    isBookingsDatesHasBooked,
    setBookingsDatesHasBooked,
    bookingsDatesHasBooked,
  };
}
export default useBookingsDatesHasBooked;
