"use client";

import React from 'react';
import { ThemeProvider } from 'next-themes';
import '../styles/admin.css';

export default function AdminLayout({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div className="admin-shell">
        {children}
      </div>
    </ThemeProvider>
  );
}