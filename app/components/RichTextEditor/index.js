"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './RichTextEditor.module.css';

const RichTextEditor = ({ value, onChange, placeholder = "Start writing..." }) => {
  const [isClient, setIsClient] = useState(false);
  const [quillInstance, setQuillInstance] = useState(null);
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || quillInstance) return;

    const initQuill = async () => {
      try {
        const Quill = (await import('quill')).default;
        
        // Import Quill CSS
        await import('quill/dist/quill.snow.css');

        if (editorRef.current && !quillRef.current) {
          const toolbarOptions = [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['blockquote', 'code-block'],
            ['clean']
          ];

          const quill = new Quill(editorRef.current, {
            theme: 'snow',
            placeholder: placeholder,
            modules: {
              toolbar: toolbarOptions
            },
            formats: [
              'header', 'font', 'size',
              'bold', 'italic', 'underline', 'strike', 'blockquote',
              'list', 'bullet', 'indent',
              'link', 'image',
              'align', 'color', 'background',
              'script', 'code-block'
            ]
          });

          // Set initial content
          if (value) {
            quill.clipboard.dangerouslyPasteHTML(value);
          }

          // Handle text changes
          quill.on('text-change', () => {
            const html = quill.root.innerHTML;
            if (onChange) {
              onChange(html);
            }
          });

          // Force LTR direction
          quill.root.setAttribute('dir', 'ltr');
          quill.root.style.direction = 'ltr';
          quill.root.style.textAlign = 'left';

          // Add mutation observer to enforce LTR
          const observer = new MutationObserver(() => {
            if (quill.root) {
              quill.root.setAttribute('dir', 'ltr');
              quill.root.style.setProperty('direction', 'ltr', 'important');
              quill.root.style.setProperty('text-align', 'left', 'important');
              
              // Force LTR on all child elements
              const allElements = quill.root.querySelectorAll('*');
              allElements.forEach(el => {
                el.style.setProperty('direction', 'ltr', 'important');
                el.style.setProperty('text-align', 'left', 'important');
              });
            }
          });

          observer.observe(quill.root, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
          });

          quillRef.current = quill;
          setQuillInstance(quill);
        }
      } catch (error) {
        console.error('Failed to initialize Quill:', error);
      }
    };

    initQuill();

    return () => {
      if (quillRef.current) {
        quillRef.current = null;
        setQuillInstance(null);
      }
    };
  }, [isClient, placeholder]);

  // Update content when value prop changes
  useEffect(() => {
    if (quillInstance && value !== undefined) {
      const currentHtml = quillInstance.root.innerHTML;
      if (currentHtml !== value) {
        quillInstance.clipboard.dangerouslyPasteHTML(value || '');
      }
    }
  }, [value, quillInstance]);

  // Don't render on server side
  if (!isClient) {
    return (
      <div className={styles.loading}>
        Loading editor...
      </div>
    );
  }

  return (
    <div className={styles.editorWrapper}>
      <div 
        ref={editorRef}
        style={{
          minHeight: '400px',
          direction: 'ltr',
          textAlign: 'left'
        }}
      />
    </div>
  );
};

export default RichTextEditor;