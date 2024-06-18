import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUser } from 'react-icons/hi2';

import Logout from '../features/authentication/Logout';
import ButtonIcon from './ButtonIcon';
import DarkModeToggle from './DarkModeToggle';

const StyledHeaderMenu = styled.ul`
  display: flex;
  gap: 0.4 rem;
`;

function HeaderMenu() {
  const navigate = useNavigate();
  return (
    <StyledHeaderMenu>
      <li>
        <DarkModeToggle />
      </li>
      <li>
        <Logout />
      </li>
      <li>
        <ButtonIcon onClick={() => navigate('/account')}>
          <HiOutlineUser />
        </ButtonIcon>
      </li>
    </StyledHeaderMenu>
  );
}

export default HeaderMenu;
