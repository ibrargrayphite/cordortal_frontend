"use client";
import React, { createContext, useContext, useEffect } from 'react';
import { usePages } from './PagesContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { pages } = usePages(); 
  const theme = pages.colors || {}; 

  useEffect(() => {
    const root = document.documentElement; // Get the root element (:root)
    // mainAccent test color #c0c0c0
    root.style.setProperty('--main-accent-color', theme.mainAccentColor||'blue');
     // mainAccentdark test color #00FF00
    root.style.setProperty('--main-accent-dark', theme.mainAccentDark||'blue');
     // bgcolor test color #9E0007
    root.style.setProperty('--bg-color', theme.bgColor||'blue');
    // headline test color #FF8000
    root.style.setProperty('--headline-color', theme.headlineColor||'blue');
    // subheadline test color #FF00FF
    root.style.setProperty('--subheadline-color', theme.subHeadlineColor||'blue');
    // content test color #8000FF
    root.style.setProperty('--content-color', theme.content||'blue');


  }, [theme]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
