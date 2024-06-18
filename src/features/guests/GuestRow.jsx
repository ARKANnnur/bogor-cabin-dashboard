import styled from 'styled-components';
import Table from '../../ui/Table';
import { Flag } from '../../ui/Flag';
import Modal from '../../ui/Modal';
import Menus from '../../ui/Menus';
import { HiPencil, HiTrash } from 'react-icons/hi2';
import ConfirmDelete from '../../ui/ConfirmDelete';
import useDeleteGuest from './useDeleteGuest';
import CreateGuestFrom from './CreateGuestForm';

const Cabin = styled.div`
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--color-grey-600);
`;

const Stacked = styled.div`
  display: flex;
  gap: 1rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

/* eslint-disable react/prop-types */
function GuestRow({ guest }) {
  const { isDeleting, deleteGuest } = useDeleteGuest();

  return (
    <Table.Row select={guest.id}>
      <Cabin>{guest.fullName}</Cabin>
      <Cabin>{guest.email}</Cabin>
      <Stacked>
        <div>{guest.nationality}</div>
        <Flag
          src={guest.countryFlag}
          alt={`country flag ${guest.nationality}`}
        />
      </Stacked>
      <Cabin>
        <div>{guest.nationalID}</div>
      </Cabin>

      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={guest.id} />
          <Menus.List id={guest.id}>
            <Modal.Open opens="edit">
              <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
            </Modal.Open>

            <Modal.Open opens="delete">
              <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
            </Modal.Open>
          </Menus.List>
        </Menus.Menu>

        <Modal.Window name="edit">
          <CreateGuestFrom guestToEdit={guest} />
        </Modal.Window>

        <Modal.Window name="delete">
          <ConfirmDelete
            resource={`Guests ${guest.fullName}`}
            onConfirm={() => deleteGuest(guest.id)}
            disabled={isDeleting}
          />
        </Modal.Window>
      </Modal>
    </Table.Row>
  );
}

export default GuestRow;
