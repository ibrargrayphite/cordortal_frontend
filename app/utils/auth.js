// Authentication utility functions

export const setTokens = (accessToken, refreshToken) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
};

export const getTokens = () => {
  if (typeof window !== 'undefined') {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken')
    };
  }
  return { accessToken: null, refreshToken: null };
};

export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

export const isAuthenticated = () => {
  // Always return false on server-side to prevent hydration mismatch
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    const accessToken = localStorage.getItem('accessToken');
    return !!accessToken;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

export const getAuthHeaders = () => {
  const { accessToken } = getTokens();
  return {
    'Content-Type': 'application/json',
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
  };
};

export const logout = () => {
  clearTokens();
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}; 