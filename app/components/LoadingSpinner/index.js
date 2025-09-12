"use client";

import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  type = 'default', 
  message = 'Loading...', 
  fullScreen = false,
  overlay = false 
}) => {
  const getSpinnerContent = () => {
    switch (type) {
      case 'dots':
        return (
          <div className={styles.dotsSpinner}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className={styles.pulseSpinner}>
            <div className={styles.pulseRing}></div>
            <div className={styles.pulseRing}></div>
            <div className={styles.pulseRing}></div>
          </div>
        );
      
      case 'bars':
        return (
          <div className={styles.barsSpinner}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
          </div>
        );
      
      case 'medical':
        return (
          <div className={styles.medicalSpinner}>
            <div className={styles.medicalCross}>
              <div className={styles.crossVertical}></div>
              <div className={styles.crossHorizontal}></div>
            </div>
            <div className={styles.medicalRing}></div>
          </div>
        );
      
      default:
        return (
          <div className={styles.defaultSpinner}>
            <div className={styles.spinnerRing}></div>
            <div className={styles.spinnerCore}></div>
          </div>
        );
    }
  };

  const containerClass = `
    ${styles.loadingContainer} 
    ${styles[size]} 
    ${fullScreen ? styles.fullScreen : ''} 
    ${overlay ? styles.overlay : ''}
  `.trim();

  return (
    <div className={containerClass}>
      <div className={styles.spinnerWrapper}>
        {getSpinnerContent()}
        {message && (
          <div className={styles.loadingMessage}>
            {message}
          </div>
        )}
        <div className={styles.loadingDots}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

// Specialized loading components for different contexts
export const PageLoader = ({ message = "Loading page..." }) => (
  <div className={styles.pageLoader}>
    <div className={styles.pageLoaderContent}>
      <div className={styles.simpleSpinner}></div>
      <p className={styles.pageLoaderMessage}>{message}</p>
    </div>
  </div>
);

export const DataLoader = ({ message = "Fetching data..." }) => (
  <LoadingSpinner 
    type="pulse" 
    size="medium" 
    message={message} 
  />
);

export const ButtonLoader = ({ message = "Processing..." }) => (
  <LoadingSpinner 
    type="dots" 
    size="small" 
    message={message} 
  />
);

export const OverlayLoader = ({ message = "Please wait..." }) => (
  <LoadingSpinner 
    type="bars" 
    size="large" 
    message={message} 
    overlay={true} 
  />
);

export default LoadingSpinner;