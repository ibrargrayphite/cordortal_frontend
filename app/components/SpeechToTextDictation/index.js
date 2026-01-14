"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { Button } from '../ui/button';
import styles from './SpeechToTextDictation.module.css';

const GEMINI_MODEL = 'gemini-2.5-flash-native-audio-preview-12-2025';

const SpeechToTextDictation = ({
  value = '',
  onChange,
  placeholder = 'Start speaking or type here...',
  tokenEndpoint = '/realtime/gemini-ephemeral/',
  disabled = false,
  className = '',
  ...props
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [liveText, setLiveText] = useState('');
  const [committedText, setCommittedText] = useState(value);

  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);

  const committedTextRef = useRef(value);
  const accumulatedLiveTextRef = useRef('');
  const onChangeRef = useRef(onChange);
  const textareaRef = useRef(null);

  const mediaStreamRef = useRef(null);

  // Keep onChange ref updated
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Get ephemeral token from backend
  const getToken = useCallback(async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      const response = await fetch(`${backendUrl}${tokenEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`Failed to get token: ${response.statusText}`);

      const data = await response.json();
      return data?.token || data?.ephemeral_token || data?.ephemeralToken || data?.accessToken || data?.access_token || data?.client_secret?.value || data?.client_secret;
    } catch (err) {
      console.error('Error fetching token:', err);
      throw err;
    }
  }, [tokenEndpoint]);

  // Update transcription
  const updateTranscription = useCallback((text, isFinal = false) => {
    if (!text || text.trim() === '') return;

    if (isFinal) {
      const spacePrefix = committedTextRef.current && !committedTextRef.current.endsWith('\n') ? ' ' : '';
      const newCommittedText = committedTextRef.current + spacePrefix + text;
      committedTextRef.current = newCommittedText;
      accumulatedLiveTextRef.current = '';

      flushSync(() => {
        setCommittedText(newCommittedText);
        setLiveText('');
      });

      if (textareaRef.current) {
        textareaRef.current.value = newCommittedText;
        textareaRef.current.setSelectionRange(newCommittedText.length, newCommittedText.length);
      }

      if (onChangeRef.current) onChangeRef.current(newCommittedText);
    } else {
      accumulatedLiveTextRef.current += text;
      const accumulated = accumulatedLiveTextRef.current;
      flushSync(() => setLiveText(accumulated));

      if (textareaRef.current) {
        const fullText = committedTextRef.current + accumulated;
        if (textareaRef.current.value !== fullText) {
          textareaRef.current.value = fullText;
          textareaRef.current.setSelectionRange(fullText.length, fullText.length);
        }
      }
    }
  }, []);

  // Handle WebSocket messages from Gemini
  const handleMessage = useCallback((event) => {
    try {
      const msg = JSON.parse(event.data);

      if (msg.type === 'transcription.result') {
        if (msg.is_final) updateTranscription(msg.text, true);
        else updateTranscription(msg.text, false);
      }

      if (msg.type === 'error') {
        console.error('❌ Gemini error:', msg);
        setError(msg.message || 'Gemini error');
      }
    } catch (err) {
      console.error('Message parse error', err);
    }
  }, [updateTranscription]);

  // Convert Float32Array to PCM16 and Base64
  const floatToPCM16 = (float32Array) => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      let sample = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    }
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  };

  // Start recording and streaming audio
  const startRecording = useCallback(async () => {
    if (isConnecting || disabled) return;

    try {
      setIsConnecting(true);
      setError(null);
      accumulatedLiveTextRef.current = '';

      const token = await getToken();
      if (!token) throw new Error('No Gemini token');

      const ws = new WebSocket(
        `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?access_token=${token}`
      );
      console.log(ws);

      wsRef.current = ws;

      ws.onopen = async () => {
        setIsRecording(true);
        setIsConnecting(false);

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const audioContext = new AudioContext({ sampleRate: 16000 });
        audioContextRef.current = audioContext;

        const source = audioContext.createMediaStreamSource(stream);
        sourceRef.current = source;

        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        source.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = (e) => {
          const pcm16 = floatToPCM16(e.inputBuffer.getChannelData(0));
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'input_audio_buffer.append', audio: pcm16 }));
          }
        };
      };

      ws.onmessage = handleMessage;
      ws.onerror = () => setError('Gemini WebSocket error');
      ws.onclose = cleanup;

    } catch (err) {
      setError(err.message);
      cleanup();
    }
  }, [getToken, handleMessage, disabled, isConnecting]);

  const stopRecording = useCallback(() => cleanup(), []);

  // Cleanup resources
  const cleanup = useCallback(() => {
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    audioContextRef.current?.close();
    wsRef.current?.close();

    processorRef.current = null;
    sourceRef.current = null;
    audioContextRef.current = null;
    wsRef.current = null;
    console.log('🛑 Stopped recording');

    setIsRecording(false);
    setIsConnecting(false);
  }, []);

  // Update committed text when value prop changes
  useEffect(() => {
    if (value !== committedTextRef.current && accumulatedLiveTextRef.current === '') {
      committedTextRef.current = value;
      setCommittedText(value);
      if (textareaRef.current) textareaRef.current.value = value;
    }
  }, [value]);

  useEffect(() => cleanup(), [cleanup]);

  const handleTextareaChange = (e) => {
    const newValue = e.target.value;
    committedTextRef.current = newValue;
    accumulatedLiveTextRef.current = '';
    setCommittedText(newValue);
    setLiveText('');
    if (onChange) onChange(newValue);
  };

  const displayText = committedText + liveText;

  return (
    <div className={`${styles.container} ${isRecording ? styles.recording : ''} ${className}`}>
      <textarea
        ref={textareaRef}
        {...props}
        value={displayText}
        onChange={handleTextareaChange}
        placeholder={placeholder}
        disabled={disabled}
        className={styles.textarea}
        style={{ color: '#374151', ...props.style }}
      />

      {isRecording && (
        <div className={styles.recordingIndicator}>
          <div className={styles.recordingDot}></div>
          <span>Recording...</span>
        </div>
      )}

      <div className={styles.controls}>
        <Button
          type="button"
          variant={isRecording ? "destructive" : "default"}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled || isConnecting}
          className={styles.recordButton}
          title={isRecording ? "Stop Recording" : "Start Recording"}
        >
          {isConnecting ? (
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
