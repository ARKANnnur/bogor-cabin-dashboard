/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { useContext } from 'react';
import { useEffect } from 'react';

const DarkModeContext = createContext();

function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useLocalStorageState(
    window.matchMedia("(prefers-color-scheme: dark)").matches 
    ,'isDarkMode');

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('class', isDarkMode ? 'dark-mode' : 'light-mode');

    if (isDarkMode) htmlElement.classList.remove('light-mode');
    else htmlElement.classList.remove('dark-mode');
  }, [isDarkMode]);

  function toggleDarkMode() {
    setIsDarkMode((isDark) => !isDark);
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined)
    throw new Error('DarkModeContext was used outside of DarkModeProvider');
  return context;
}

export { DarkModeProvider, useDarkMode };
