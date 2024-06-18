import { HiMoon, HiSun } from 'react-icons/hi2';
import ButtonIcon from './ButtonIcon';
import { useDarkMode } from '../contexts/DarkModeContexts';

function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <ButtonIcon onClick={toggleDarkMode}>
      {isDarkMode ? <HiMoon /> : <HiSun />}
    </ButtonIcon>
  );
}

export default DarkModeToggle;
