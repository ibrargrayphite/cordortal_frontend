"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';
import styles from './Toast.module.css';

// Toast Context
const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      duration,
      isVisible: false
    };

    setToasts(prev => [...prev, newToast]);

    // Trigger animation after a brief delay
    setTimeout(() => {
      setToasts(prev => 
        prev.map(toast => 
          toast.id === id ? { ...toast, isVisible: true } : toast
        )
      );
    }, 50);

    // Auto remove toast
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => 
      prev.map(toast => 
        toast.id === id ? { ...toast, isVisible: false } : toast
      )
    );

    // Remove from array after animation completes
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300);
  };

  const showSuccess = (message, duration) => addToast(message, 'success', duration);
  const showError = (message, duration) => addToast(message, 'error', duration);
  const showWarning = (message, duration) => addToast(message, 'warning', duration);
  const showInfo = (message, duration) => addToast(message, 'info', duration);

  return (
    <ToastContext.Provider value={{
      addToast,
      removeToast,
      showSuccess,
      showError,
      showWarning,
      showInfo
    }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

// Individual Toast Component
const Toast = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <i className="fas fa-check-circle"></i>;
      case 'error':
        return <i className="fas fa-exclamation-circle"></i>;
      case 'warning':
        return <i className="fas fa-exclamation-triangle"></i>;
      case 'info':
      default:
        return <i className="fas fa-info-circle"></i>;
    }
  };

  return (
    <div 
      className={`${styles.toast} ${styles[toast.type]} ${toast.isVisible ? styles.visible : ''}`}
      onClick={() => onRemove(toast.id)}
    >
      <div className={styles.toastIcon}>
        {getIcon()}
      </div>
      <div className={styles.toastContent}>
        <div className={styles.toastMessage}>
          {toast.message}
        </div>
      </div>
      <button 
        className={styles.closeButton}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(toast.id);
        }}
      >
        <i className="fas fa-times"></i>
      </button>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ 
            animationDuration: `${toast.duration}ms`,
            animationPlayState: toast.isVisible ? 'running' : 'paused'
          }}
        ></div>
      </div>
    </div>
  );
};

export default ToastProvider;