import Menus from '../../ui/Menus';
import Spinner from '../../ui/Spinner';
import Table from '../../ui/Table';
import GuestRow from './GuestRow';
import useGuests from './useGuests';

function GuestsTable() {
  const { isLoading, guests } = useGuests();

  if (isLoading) return <Spinner />;

  return (
    <Menus>
      <Table columns="1fr 1.2fr 1.6fr 0.8fr 3.2rem">
        <Table.Header>
          <div>Name Guests</div>
          <div>Email</div>
          <div>Nationality</div>
          <div>National Id</div>
        </Table.Header>

        <Table.Body
          data={guests}
          render={(guest) => <GuestRow guest={guest} key={guest.id} />}
        />
      </Table>
    </Menus>
  );
}

export default GuestsTable;
