"use client";

import React, { createContext, useContext, useState } from 'react';

// Create a Context
const PagesContext = createContext();

// Context Provider Component
export const PagesProvider = ({ children, pagesData = {} }) => {
  const [pages, setPages] = useState(pagesData);

  return (
    <PagesContext.Provider value={{ pages, setPages }}>
      {children}
    </PagesContext.Provider>
  );
};

// Custom Hook to use the PagesContext
export const usePages = () => useContext(PagesContext);
