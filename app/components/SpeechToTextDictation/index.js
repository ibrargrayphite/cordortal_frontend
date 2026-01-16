"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../ui/button';
import styles from './SpeechToTextDictation.module.css';

const SpeechToTextDictation = ({
  value = '',
  onChange,
  placeholder = 'Start speaking or type here...',
  transcriptionEndpoint = '/realtime/transcribe/openai/', // Default endpoint
  disabled = false,
  className = '',
  ...props
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState(null);
  const [committedText, setCommittedText] = useState(value);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const textareaRef = useRef(null);
  const onChangeRef = useRef(onChange);

  // Keep onChange ref updated
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Update committed text when value prop changes
  useEffect(() => {
    if (value !== committedText) {
      setCommittedText(value);
      if (textareaRef.current) textareaRef.current.value = value;
    }
  }, [value, committedText]);

  const startRecording = useCallback(async () => {
    if (isRecording || isTranscribing || disabled) return;

    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());

        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Could not access microphone');
    }
  }, [isRecording, isTranscribing, disabled]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsTranscribing(true); // Set loading state immediately after stop
    }
  }, [isRecording]);

  const transcribeAudio = async (audioBlob) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');

      const response = await fetch(`${backendUrl}${transcriptionEndpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.text) {
        const newText = committedText + (committedText ? ' ' : '') + data.text;
        setCommittedText(newText);

        if (textareaRef.current) {
          textareaRef.current.value = newText;
          textareaRef.current.focus(); // Focus back on textarea
        }

        if (onChangeRef.current) {
          onChangeRef.current(newText);
        }
      }

    } catch (err) {
      console.error('Transcription error:', err);
      setError('Failed to transcribe audio');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleTextareaChange = (e) => {
    const newValue = e.target.value;
    setCommittedText(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <div className={`${styles.container} ${isRecording ? styles.recording : ''} ${className}`}>
      <textarea
        ref={textareaRef}
        {...props}
        value={committedText}
        onChange={handleTextareaChange}
        placeholder={placeholder}
        disabled={disabled || isTranscribing}
        className={styles.textarea}
        style={{ color: '#374151', ...props.style }}
      />

      {isRecording && (
        <div className={styles.recordingIndicator}>
          <div className={styles.recordingDot}></div>
          <span>Recording...</span>
        </div>
      )}

      {isTranscribing && (
        <div className={styles.recordingIndicator}>
          <div className={styles.spinner}></div>
          <span>Transcribing...</span>
        </div>
      )}

      <div className={styles.controls}>
        <Button
          type="button"
          variant={isRecording ? "destructive" : "default"}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled || isTranscribing}
          className={styles.recordButton}
          title={isRecording ? "Stop Recording" : "Start Checking"}
        >
          {isTranscribing ? (
            <div className={styles.spinner}></div>
          ) : isRecording ? (
            <i className="fas fa-stop"></i>
          ) : (
            <i className="fas fa-microphone"></i>
          )}
        </Button>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}
    </div>
  );
};

export default SpeechToTextDictation;
