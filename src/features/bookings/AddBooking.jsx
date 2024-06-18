import Button from '../../ui/Button';
import CreateBookingForm from './CreateBookingForm';
import Modal from '../../ui/Modal';

function AddBooking() {
  return (
    <Modal>
      <Modal.Open opens='booking-form'>
        <Button>Add new Booking</Button>
      </Modal.Open>
      <Modal.Window name='booking-form'>
        <CreateBookingForm />
      </Modal.Window>
    </Modal>
  )
}

export default AddBooking
