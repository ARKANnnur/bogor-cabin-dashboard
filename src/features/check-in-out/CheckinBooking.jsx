import { useEffect, useState } from 'react';
import styled from 'styled-components';
import BookingDataBox from '../../features/bookings/BookingDataBox';

import Heading from '../../ui/Heading';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import ButtonText from '../../ui/ButtonText';
import Checkbox from '../../ui/Checkbox';
import Spinner from '../../ui/Spinner';

import Row from '../../ui/Row';
import { useMoveBack } from '../../hooks/useMoveBack';
import useBooking from '../bookings/useBooking';
import useCheckin from './useCheckin';
import { formatCurrency } from '../../utils/helpers';
import useSettings from '../settings/useSettings';
import useUser from '../authentication/useUser';

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const { isLoading, booking } = useBooking();
  const { isCheckin, checkin } = useCheckin();
  const { settings, isLoading: isSettings } = useSettings();
  const { guestUser } = useUser();

  const [confirmPaid, setConfirmPaid] = useState(false);
  const [addBreakfast, setAddBreakfast] = useState(false);

  const moveBack = useMoveBack();
  useEffect(() => {
    setConfirmPaid(booking?.isPaid ?? false);
  }, [booking.isPaid]);

  const {
    id: bookingId,
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights,
    guests,
  } = booking;

  const optionalBreakfast = settings.breakfastPrice * numNights * numGuests;

  if (isLoading || isSettings) return <Spinner />;

  function handleCheckin() {
    if (guestUser) return;
    if (!confirmPaid) return;
    if (addBreakfast) {
      checkin({
        bookingId,
        breakfast: {
          hasBreakfast: true,
          extrasPrice: optionalBreakfast,
          totalPrice: totalPrice + optionalBreakfast,
        },
      });
    } else {
      checkin({ bookingId, breakfast: {} });
    }
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />
      {!hasBreakfast && (
        <Box>
          <Checkbox
            checked={addBreakfast}
            disabled={addBreakfast || guestUser}
            onChange={() => {
              setAddBreakfast((add) => !add);
              setConfirmPaid(false);
            }}
            id="breakfast"
          >
            Want add breakfast for {formatCurrency(optionalBreakfast)}
          </Checkbox>
        </Box>
      )}

      <Box>
        <Checkbox
          checked={confirmPaid}
          disabled={confirmPaid || isCheckin || guestUser}
          onChange={() => setConfirmPaid((confirm) => !confirm)}
          id="confirm"
        >
          I confirm that {guests.fullName} has paid the total amount{' '}
          {hasBreakfast
            ? formatCurrency(totalPrice)
            : `${formatCurrency(
                totalPrice + optionalBreakfast
              )} (${formatCurrency(totalPrice)} + ${formatCurrency(
                optionalBreakfast
              )})`}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button
          onClick={handleCheckin}
          disabled={!confirmPaid || isCheckin || guestUser}
        >
          Check in booking #{bookingId}
        </Button>
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
