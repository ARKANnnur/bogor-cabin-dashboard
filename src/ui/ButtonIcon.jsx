import styled from 'styled-components';

const ButtonIcon = styled.button`
  background-color: var(--color-grey-0);
  border: none;
  padding: 0.6rem;
  border-radius: var(--border-radius-sm);
  transition: all 0.2s;

  &:hover {
    & svg {
      color: var(--color-brand-800);
    }
  }

  & svg {
    width: 2.2rem;
    height: 2.2rem;
    color: var(--color-brand-600);
  }
`;

export default ButtonIcon;
