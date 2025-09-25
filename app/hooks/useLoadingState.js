"use client";

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing loading states with skeleton display
 * @param {Object} options - Configuration options
 * @param {boolean} options.initialLoading - Initial loading state
 * @param {number} options.minLoadingTime - Minimum time to show skeleton (ms)
 * @param {number} options.maxLoadingTime - Maximum time to show skeleton (ms)
 * @param {boolean} options.enableSkeleton - Whether to enable skeleton loading
 * @returns {Object} Loading state and control functions
 */
export const useLoadingState = ({
  initialLoading = false,
  minLoadingTime = 500,
  maxLoadingTime = 5000,
  enableSkeleton = true
} = {}) => {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [showSkeleton, setShowSkeleton] = useState(initialLoading && enableSkeleton);
  const [loadingStartTime, setLoadingStartTime] = useState(null);

  // Start loading
  const startLoading = useCallback(() => {
    setIsLoading(true);
    setShowSkeleton(enableSkeleton);
    setLoadingStartTime(Date.now());
  }, [enableSkeleton]);

  // Stop loading
  const stopLoading = useCallback(() => {
    const currentTime = Date.now();
    const elapsedTime = loadingStartTime ? currentTime - loadingStartTime : 0;
    const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

    if (remainingTime > 0) {
      // Ensure minimum loading time
      setTimeout(() => {
        setIsLoading(false);
        setShowSkeleton(false);
      }, remainingTime);
    } else {
      // Add a small delay for smooth transition
      setTimeout(() => {
        setIsLoading(false);
        setShowSkeleton(false);
      }, 100);
    }
  }, [loadingStartTime, minLoadingTime]);

  // Reset loading state
  const resetLoading = useCallback(() => {
    setIsLoading(false);
    setShowSkeleton(false);
    setLoadingStartTime(null);
  }, []);

  // Set loading state directly
  const setLoading = useCallback((loading) => {
    if (loading) {
      startLoading();
    } else {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  // Auto-stop loading after max time
  useEffect(() => {
    if (isLoading && maxLoadingTime > 0) {
      const timer = setTimeout(() => {
        if (isLoading) {
          console.warn('Loading timeout reached, stopping loading state');
          stopLoading();
        }
      }, maxLoadingTime);

      return () => clearTimeout(timer);
    }
  }, [isLoading, maxLoadingTime, stopLoading]);

  return {
    isLoading,
    showSkeleton,
    startLoading,
    stopLoading,
    resetLoading,
    setLoading
  };
};

/**
 * Hook for managing multiple loading states
 * @param {Object} loadingStates - Object with loading state names as keys
 * @returns {Object} Loading states and control functions
 */
export const useMultipleLoadingStates = (loadingStates = {}) => {
  const [states, setStates] = useState(loadingStates);

  const setLoadingState = useCallback((stateName, loading) => {
    setStates(prev => ({
      ...prev,
      [stateName]: loading
    }));
  }, []);

  const startLoading = useCallback((stateName) => {
    setLoadingState(stateName, true);
  }, [setLoadingState]);

  const stopLoading = useCallback((stateName) => {
    setLoadingState(stateName, false);
  }, [setLoadingState]);

  const resetAllStates = useCallback(() => {
    const resetStates = Object.keys(states).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    setStates(resetStates);
  }, [states]);

  const isAnyLoading = Object.values(states).some(loading => loading);
  const isAllLoading = Object.values(states).every(loading => loading);

  return {
    states,
    setLoadingState,
    startLoading,
    stopLoading,
    resetAllStates,
    isAnyLoading,
    isAllLoading
  };
};

/**
 * Hook for managing async operations with loading states
 * @param {Function} asyncFunction - The async function to execute
 * @param {Object} options - Configuration options
 * @returns {Object} Loading state and execute function
 */
export const useAsyncLoading = (asyncFunction, options = {}) => {
  const {
    minLoadingTime = 500,
    enableSkeleton = true,
    onSuccess,
    onError
  } = options;

  const loadingState = useLoadingState({
    minLoadingTime,
    enableSkeleton
  });

  const execute = useCallback(async (...args) => {
    try {
      loadingState.startLoading();
      const result = await asyncFunction(...args);
      if (onSuccess) onSuccess(result);
      return result;
    } catch (error) {
      if (onError) onError(error);
      throw error;
    } finally {
      loadingState.stopLoading();
    }
  }, [asyncFunction, loadingState, onSuccess, onError]);

  return {
    ...loadingState,
    execute
  };
};

export default useLoadingState;