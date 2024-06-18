import styled from 'styled-components';
import { useMoveBack } from '../../hooks/useMoveBack';
import { useNavigate } from 'react-router-dom';
import { HiArrowUpOnSquare } from 'react-icons/hi2';

import BookingDataBox from './BookingDataBox';
import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import Tag from '../../ui/Tag';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import ButtonText from '../../ui/ButtonText';
import Spinner from '../../ui/Spinner';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import Empty from '../../ui/Empty';

import useBooking from './useBooking';
import useDeleteBooking from './useDeleteBooking';
import CheckoutButton from '../check-in-out/CheckoutButton';

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { isLoading, booking } = useBooking();
  const { isLoading: isDeleting, deleteBooking } = useDeleteBooking();
  const { id: bookingId, status } = booking;

  const navigate = useNavigate();
  const moveBack = useMoveBack();

  const statusToTagName = {
    unconfirmed: 'blue',
    'checked-in': 'green',
    'checked-out': 'silver',
  };

  if (isLoading) return <Spinner />;
  if (!status) return <Empty resourceName="booking" />;

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{bookingId}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace('-', ' ')}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        {status === 'unconfirmed' && (
          <Button onClick={() => navigate(`/checkin/${bookingId}`)}>
            Check in
          </Button>
        )}
        {status === 'checked-in' && (
          <CheckoutButton icon={<HiArrowUpOnSquare />} bookingId={bookingId} />
        )}

        <Modal>
          <Modal.Open>
            <Button variation="danger">Delete</Button>
          </Modal.Open>
          <Modal.Window>
            <ConfirmDelete
              resource="booking"
              onConfirm={() =>
                deleteBooking(bookingId, { onSettled: navigate(-1) })
              }
              disabled={isDeleting}
            />
          </Modal.Window>
        </Modal>

        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
