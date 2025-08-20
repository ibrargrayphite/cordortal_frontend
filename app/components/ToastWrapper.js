"use client";

import { ToastProvider } from './Toast';

export default function ToastWrapper({ children }) {
  return <ToastProvider>{children}</ToastProvider>;
} 