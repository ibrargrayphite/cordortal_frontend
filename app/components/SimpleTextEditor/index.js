"use client";

import React from 'react';
import styles from './SimpleTextEditor.module.css';

const SimpleTextEditor = ({ value, onChange, placeholder = "Start writing..." }) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={styles.editorWrapper}>
      <textarea
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        className={styles.textarea}
        dir="ltr"
        style={{ direction: 'ltr', textAlign: 'left' }}
      />
    </div>
  );
};

export default SimpleTextEditor;