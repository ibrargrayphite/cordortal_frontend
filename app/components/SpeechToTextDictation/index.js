"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { Button } from '../ui/button';
import styles from './SpeechToTextDictation.module.css';

const GEMINI_MODEL = 'models/gemini-live-2.5-flash-native-audio';
// const GEMINI_MODEL = 'models/gemini-2.0-flash-exp';

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
  const [connectionTimeLeft, setConnectionTimeLeft] = useState(null);

  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);

  // Session management refs
  const sessionResumptionTokenRef = useRef(null);
  const generationCompleteRef = useRef(false);

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

      // Handle session resumption updates
      if (msg.sessionResumptionUpdate) {
        const update = msg.sessionResumptionUpdate;
        if (update.resumable && update.new_handle) {
          sessionResumptionTokenRef.current = update.new_handle;
          console.log('✅ Session resumption token updated:', update.new_handle);
        }
      }

      // Handle GoAway message - connection will terminate
      if (msg.goAway) {
        const timeLeftMs = msg.goAway.time_left?.seconds * 1000 || 0;
        setConnectionTimeLeft(timeLeftMs);
        console.warn('⚠️ Server will disconnect in:', msg.goAway.time_left);
        setError(`Connection will close in ${Math.ceil(timeLeftMs / 1000)} seconds`);
      }

      // Handle generation complete
      if (msg.serverContent?.generation_complete) {
        generationCompleteRef.current = true;
        console.log('✅ Generation complete');
      }

      if (msg.serverContent?.modelTurn?.parts) {
        const parts = msg.serverContent.modelTurn.parts;
        for (const part of parts) {
          if (part.text) {
            updateTranscription(part.text, true); // Consider standard text parts as final for now or accumulate
          }
        }
      }

      // Note: The original code used msg.type === 'transcription.result' which is not standard Gemini Live API
      // The Gemini Live API sends 'serverContent' with 'modelTurn'.
      // However, if using a proxy that transforms it, the original code might be valid.
      // But the User asked for "Gemini Live API" which typically uses `serverContent`.
      // I will keep the original logic just in case, but assume the user might be using the official protocol.
      // Actually, let's stick to the user's parsing logic if they are sure, but the crash implies connection issues.
      // I will add a check for the standard fields too.

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
      generationCompleteRef.current = false;

      const token = await getToken();
      if (!token) throw new Error('No Gemini token');

      // Build session configuration with compression and resumption
      const setupConfig = {
        model: GEMINI_MODEL,
        generationConfig: {
          responseModalities: ['TEXT'], // We want TEXT back, not AUDIO for dictation
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } }
          }
        },
        // Enable context window compression for unlimited session duration
        // (Optional: remove if causing issues, but keeping purely as config)
        // contextWindowCompression: {
        //   slidingWindow: {},
        // },
      };

      // Remove undefined handle if no previous session
      if (sessionResumptionTokenRef.current) {
        setupConfig.sessionResumption = {
          handle: sessionResumptionTokenRef.current
        }
      }

      // Determine if token is API Key or OAuth Token
      const isApiKey = token.startsWith('AIza');
      const authParam = isApiKey ? `key=${token}` : `access_token=${token}`;
      console.log(`🔑 Using ${isApiKey ? 'API Key' : 'Access Token'} for authentication`);

      const ws = new WebSocket(
        `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?${authParam}`
      );
      console.log('🔌 WebSocket created');

      wsRef.current = ws;

      ws.onopen = async () => {
        console.log('📡 WebSocket connected, sending setup...');

        // Send setup message with session configuration
        ws.send(JSON.stringify({
          setup: setupConfig,
        }));

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
            // Realtime API expects specific format:
            ws.send(JSON.stringify({
              realtime_input: {
                media_chunks: [{
                  mime_type: "audio/pcm;rate=16000",
                  data: pcm16
                }]
              }
            }));
          }
        };
      };

      ws.onmessage = handleMessage;
      ws.onerror = (e) => {
        console.error("WebSocket Error:", e);
        setError('Gemini WebSocket error');
      };
      ws.onclose = (e) => {
        console.log("WebSocket Closed:", e.code, e.reason);
        cleanup();
      };

    } catch (err) {
      setError(err.message);
      cleanup();
    }
  }, [getToken, handleMessage, disabled, isConnecting]);

  const stopRecording = useCallback(() => cleanup(), []);

  // Cleanup resources
  const cleanup = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current.onaudioprocess = null;
    }
    sourceRef.current?.disconnect();
    audioContextRef.current?.close();

    // Stop tracks to release microphone
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    wsRef.current?.close();

    processorRef.current = null;
    sourceRef.current = null;
    audioContextRef.current = null;
    wsRef.current = null;
    console.log('🛑 Stopped recording');

    setIsRecording(false);
    setIsConnecting(false);
    setConnectionTimeLeft(null);
  }, []);

  // Attempt to resume session if available
  const resumeSession = useCallback(async () => {
    if (!sessionResumptionTokenRef.current) return false;

    console.log('🔄 Attempting to resume session...');
    try {
      await startRecording();
      return true;
    } catch (err) {
      console.error('Failed to resume session:', err);
      sessionResumptionTokenRef.current = null;
      return false;
    }
  }, [startRecording]);

  // Update committed text when value prop changes
  useEffect(() => {
    if (value !== committedTextRef.current && accumulatedLiveTextRef.current === '') {
      committedTextRef.current = value;
      setCommittedText(value);
      if (textareaRef.current) textareaRef.current.value = value;
    }
  }, [value]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

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
