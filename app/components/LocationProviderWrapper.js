"use client";

import { LocationProvider } from '../context/LocationContext';

export default function LocationProviderWrapper({ children, pagesData }) {
  return (
    <LocationProvider pagesData={pagesData}>
      {children}
    </LocationProvider>
  );
}

