import TableOperations from '../../ui/TableOperations';
import Filter from '../../ui/Filter';

function CabinTableOperation() {
  return (
    <TableOperations>
      <Filter
        filteredField="discount"
        options={[
          { value: 'all', label: 'All' },
          { value: 'no-discount', label: 'No discount' },
          { value: 'with-discount', label: 'With discount' },
        ]}
      />
    </TableOperations>
  );
}

export default CabinTableOperation;
