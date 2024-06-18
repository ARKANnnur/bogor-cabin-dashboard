/* eslint-disable react/prop-types */
import Button from '../../ui/Button';
import useCheckout from './useCheckout';

function CheckoutButton({ bookingId }) {
  const { isCheckingout, checkout } = useCheckout();

  return (
    <Button
      variation="danger"
      size="small"
      onClick={() => checkout(bookingId)}
      disabled={isCheckingout}
    >
      Check out
    </Button>
  );
}

export default CheckoutButton;
