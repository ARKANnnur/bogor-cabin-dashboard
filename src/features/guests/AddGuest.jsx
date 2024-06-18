import Button from '../../ui/Button';
import CreateGuestForm from './CreateGuestForm';
import Modal from '../../ui/Modal';

function AddGuest() {
  return (
    <Modal>
      <Modal.Open opens='guest-form'>
        <Button>Add new Guest</Button>
      </Modal.Open>
      <Modal.Window name='guest-form'>
        <CreateGuestForm />
      </Modal.Window>
    </Modal>
  )
}

export default AddGuest
