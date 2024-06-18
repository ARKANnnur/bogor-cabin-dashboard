/* eslint-disable react/prop-types */
import { useSearchParams } from 'react-router-dom';
import StyledSelect from './Select';

function SortBy({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  // const sortBy = searchParams.get('sortBy') || '';

  function handleChange(e) {
    searchParams.set('sortBy', e.target.value);
    setSearchParams(searchParams);
  }

  return (
    <StyledSelect>
      {options.map((option) => (
        <option
          type="white"
          onClick={handleChange}
          value={option.value}
          key={option.value}
        >
          {option.label}
        </option>
      ))}
    </StyledSelect>
  );
}

export default SortBy;
