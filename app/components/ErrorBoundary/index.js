import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // Log more details for debugging
    console.error('Error stack:', error.stack);
    console.error('Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{
          padding: '1rem',
          border: '1px solid #ef4444',
          borderRadius: '6px',
          backgroundColor: '#fef2f2',
          color: '#991b1b',
          margin: '1rem 0'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#dc2626' }}>
            Something went wrong with the editor.
          </h3>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem' }}>
            Please refresh the page and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 