/* eslint-disable react/prop-types */
import Button from '../../ui/Button';
import useUser from '../authentication/useUser';
import useCheckout from './useCheckout';

function CheckoutButton({ bookingId }) {
  const { isCheckingout, checkout } = useCheckout();
  const { guestUser } = useUser();

  return (
    <Button
      variation="danger"
      size="small"
      onClick={() => checkout(bookingId)}
      disabled={isCheckingout || guestUser}
    >
      Check out
    </Button>
  );
}

export default CheckoutButton;
