"use client";

import React, { useState } from 'react';

const CopyableText = ({ 
  text, 
  displayText = null, 
  type = 'text', // 'email' or 'phone' or 'text'
  showIcon = true 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'email':
        return '✉️';
      case 'phone':
        return '📞';
      default:
        return '📋';
    }
  };

  const formatText = () => {
    if (displayText) return displayText;
    
    switch (type) {
      case 'phone':
        // Format phone number if it's a valid US number
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length === 10) {
          return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }
        return text;
      default:
        return text;
    }
  };

  if (!text) {
    return <span style={{ color: 'var(--admin-muted-foreground)' }}>—</span>;
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.5rem',
      maxWidth: '100%'
    }}>
      {showIcon && (
        <span style={{ fontSize: '0.875rem' }}>{getIcon()}</span>
      )}
      <span 
        style={{ 
          minWidth: 0,
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
        title={text}
      >
        {formatText()}
      </span>
      <button
        onClick={handleCopy}
        className="admin-button admin-button-ghost"
        style={{ 
          padding: '0.25rem',
          width: '24px',
          height: '24px',
          fontSize: '0.75rem'
        }}
        title={copied ? 'Copied!' : 'Copy to clipboard'}
        aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
      >
        {copied ? '✅' : '📋'}
      </button>
      
      {/* Tooltip */}
      {copied && (
        <div
          style={{
            position: 'absolute',
            top: '-2rem',
            right: 0,
            backgroundColor: 'var(--admin-foreground)',
            color: 'var(--admin-background)',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          Copied!
        </div>
      )}
    </div>
  );
};

export default CopyableText;