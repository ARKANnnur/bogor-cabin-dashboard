import styled from 'styled-components';

const StyledFormRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
  width: 64%;
  margin: 15px 0;
`;
const Label = styled.label`
  font-weight: 500;
  width: 1/2;
`;
const DayPicker = styled.div`
  width: 1/2;
`;

// eslint-disable-next-line react/prop-types
function FormFlex({ children }) {
  return (
    <StyledFormRow>
      <Label htmlFor="selectDate">Select Date</Label>
      <DayPicker id="selectDate">{children}</DayPicker>
    </StyledFormRow>
  );
}

export default FormFlex;
