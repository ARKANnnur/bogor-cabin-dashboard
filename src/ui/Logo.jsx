import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContexts';

const StyledLogo = styled.div`
  text-align: center;
`;

const Img = styled.img`
  height: 9.6rem;
  width: auto;
`;

function Logo() {
  const { isDarkMode } = useDarkMode();
  const location = useLocation();

  const src = isDarkMode
    ? '/img/logoCabin-dark.png'
    : '/img/logoCabin-light.png';
  const logoStyle =
    location.pathname === '/login' ? { height: '15rem', width: 'auto' } : {};

  return (
    <StyledLogo>
      <Img src={src} alt="Logo" style={logoStyle} />
    </StyledLogo>
  );
}

export default Logo;
