"use client";

import { useEffect } from 'react';

const ThirdPartyChatWidget = () => {
  useEffect(() => {
    // Only load the script if it hasn't been loaded already
    if (document.querySelector('script[src*="roboreception.co.uk"]')) {
      return;
    }

    const loadScript = () => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://chat.roboreception.co.uk/widget/f774a99ae12d86a0c03ee1fcf5291718.js';
      script.async = true;
      document.head.appendChild(script);
    };

    // Load script when component mounts
    loadScript();

    // Cleanup function to remove script when component unmounts
    return () => {
      const existingScript = document.querySelector('script[src*="roboreception.co.uk"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default ThirdPartyChatWidget;