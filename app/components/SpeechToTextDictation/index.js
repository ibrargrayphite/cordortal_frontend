"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { Button } from '../ui/button';
import styles from './SpeechToTextDictation.module.css';

const SpeechToTextDictation = ({
  value = '',
  onChange,
  placeholder = 'Start speaking or type here...',
  tokenEndpoint = '/realtime/ephemeral/',
  disabled = false,
  className = '',
  ...props
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [liveText, setLiveText] = useState('');
  const [committedText, setCommittedText] = useState(value);

  const peerConnectionRef = useRef(null);
  const dataChannelRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const committedTextRef = useRef(value);
  const accumulatedLiveTextRef = useRef('');
  const onChangeRef = useRef(onChange);
  const textareaRef = useRef(null);
  const sessionConfigSentRef = useRef(false);

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
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get token: ${response.statusText}`);
      }

      const data = await response.json();
      return data.token || data.ephemeral_token || data.client_secret?.value || data.client_secret;
    } catch (err) {
      console.error('Error fetching token:', err);
      throw err;
    }
  }, [tokenEndpoint]);

  // Optimized function to update transcription text with minimal delay
  const updateTranscription = useCallback((text, isFinal = false) => {
    if (!text || text.trim() === '') return;

    if (isFinal) {
      // Update committed text immediately
      const spacePrefix = committedTextRef.current && !committedTextRef.current.endsWith('\n') ? ' ' : '';
      const newCommittedText = committedTextRef.current + spacePrefix + text;
      committedTextRef.current = newCommittedText;
      accumulatedLiveTextRef.current = '';

      // Use flushSync for immediate DOM update
      flushSync(() => {
        setCommittedText(newCommittedText);
        setLiveText('');
      });

      // Update textarea directly for instant visual feedback
      if (textareaRef.current) {
        textareaRef.current.value = newCommittedText;
        textareaRef.current.setSelectionRange(newCommittedText.length, newCommittedText.length);
      }

      // Call onChange immediately
      if (onChangeRef.current) {
        onChangeRef.current(newCommittedText);
      }
    } else {
      // For deltas, accumulate immediately
      accumulatedLiveTextRef.current += text;
      const accumulated = accumulatedLiveTextRef.current;
      const fullText = committedTextRef.current + accumulated;

      // CRITICAL: Use flushSync for immediate update
      flushSync(() => {
        setLiveText(accumulated);
      });

      // Direct DOM update for instant visual feedback (bypasses React batching)
      if (textareaRef.current && textareaRef.current.value !== fullText) {
        textareaRef.current.value = fullText;
        const length = fullText.length;
        textareaRef.current.setSelectionRange(length, length);
      }
    }
  }, []);

  // Call onChange when committedText changes
  useEffect(() => {
    if (onChangeRef.current && committedText !== value) {
      onChangeRef.current(committedText);
    }
  }, [committedText, value]);

  // Send session config - extracted to separate function for reuse
  const sendSessionConfig = useCallback(() => {
    if (!dataChannelRef.current || sessionConfigSentRef.current) return;

    if (dataChannelRef.current.readyState === 'open') {
      const sessionConfig = {
        type: 'session.update',
        session: {
          modalities: ['audio', 'text'],
          input_audio_format: 'pcm16',
          output_audio_format: 'pcm16',
          input_audio_transcription: {
            model: 'gpt-4o-transcribe',
            language: 'en'
          },
          // MINIMIZED turn_detection delays for fastest response
          turn_detection: {
            type: "semantic_vad",
            eagerness: "medium", // optional
            create_response: true, // only in conversation mode
            interrupt_response: true, // only in conversation mode
          },
          input_audio_noise_reduction: {
            "type": "near_field"
          },
          tools: [],
          tool_choice: 'none'
        }
      };

      dataChannelRef.current.send(JSON.stringify(sessionConfig));
      sessionConfigSentRef.current = true;
      console.log('📤 Session config sent');
    }
  }, []);

  // Handle messages from OpenAI via data channel
  const handleMessage = useCallback((event) => {
    try {
      const message = JSON.parse(event.data);

      // Handle session.updated - confirms session is ready
      if (message.type === 'session.updated') {
        setIsRecording(true);
        setIsConnecting(false);
        return;
      }

      // Handle input audio transcription delta - these come during speech with gpt-4o-transcribe
      if (message.type === 'conversation.item.input_audio_transcription.delta') {
        let delta = '';

        if (typeof message.delta === 'string') {
          delta = message.delta;
        } else if (message.delta && typeof message.delta === 'object') {
          delta = message.delta.text || message.delta.transcript || message.delta.delta || '';
        } else if (message.text) {
          delta = message.text;
        }

        if (delta) {
          updateTranscription(delta, false);
          return;
        }
      }

      // Handle input audio transcription started
      if (message.type === 'conversation.item.input_audio_transcription.started') {
        console.log('🎤 Transcription started');
      }

      // Handle input audio transcription completed
      if (message.type === 'conversation.item.input_audio_transcription.completed') {
        const transcript = message.transcript || message.text || '';
        if (transcript) {
          accumulatedLiveTextRef.current = '';
          updateTranscription(transcript, true);
          return;
        }
      }

      // Handle conversation.item.created - might have transcription
      if (message.type === 'conversation.item.created') {
        const item = message.item;

        if (item && item.role === 'user') {
          if (item.input_audio_transcription) {
            const transcription = item.input_audio_transcription;
            const text = typeof transcription === 'string'
              ? transcription
              : (transcription.text || transcription.transcript || '');

            if (text) {
              accumulatedLiveTextRef.current = '';
              updateTranscription(text, true);
              return;
            }
          }

          if (item.content && Array.isArray(item.content)) {
            for (const contentItem of item.content) {
              if (contentItem.type === 'input_audio' && contentItem.transcription) {
                const text = typeof contentItem.transcription === 'string'
                  ? contentItem.transcription
                  : (contentItem.transcription.text || contentItem.transcription.transcript || '');
                if (text) {
                  accumulatedLiveTextRef.current = '';
                  updateTranscription(text, true);
                  return;
                }
              }
            }
          }
        }
      }

      // Handle conversation.item.updated
      if (message.type === 'conversation.item.updated') {
        const item = message.item;
        if (item && item.role === 'user' && item.input_audio_transcription) {
          const transcription = item.input_audio_transcription;
          const text = typeof transcription === 'string'
            ? transcription
            : (transcription.text || transcription.transcript || '');
          if (text) {
            accumulatedLiveTextRef.current = '';
            updateTranscription(text, true);
            return;
          }
        }
      }

      // Handle speech detection
      if (message.type === 'input_audio_buffer.speech_started') {
        accumulatedLiveTextRef.current = '';
        flushSync(() => {
          setLiveText('');
        });
        if (textareaRef.current) {
          textareaRef.current.value = committedTextRef.current;
        }
      }

      // Handle errors
      if (message.type === 'error') {
        console.error('❌ OpenAI error:', message.error);
        const errorMessage = message.error?.message || message.error || 'Unknown error';
        setError(`Error: ${errorMessage}`);
      }

    } catch (err) {
      console.error('Error parsing message:', err);
    }
  }, [updateTranscription]);


  // Start recording with WebRTC
  const startRecording = useCallback(async () => {
    if (isConnecting || disabled) return;

    try {
      setIsConnecting(true);
      setError(null);
      accumulatedLiveTextRef.current = '';
      setLiveText('');
      sessionConfigSentRef.current = false;

      const token = await getToken();
      if (!token) {
        throw new Error('No token received from backend');
      }

      // Get media stream - removed sampleRate constraint (let browser optimize)
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      // Add audio tracks
      mediaStreamRef.current.getAudioTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, mediaStreamRef.current);
      });

      // Create data channel
      dataChannelRef.current = peerConnectionRef.current.createDataChannel('oai-events', {
        ordered: true,
      });

      dataChannelRef.current.onmessage = handleMessage;

      dataChannelRef.current.onopen = () => {
        // Send session config IMMEDIATELY when data channel opens
        sendSessionConfig();
      };

      dataChannelRef.current.onerror = (err) => {
        console.error('❌ Data channel error:', err);
        setError('Data channel error');
      };

      dataChannelRef.current.onclose = () => {
        console.log('🔴 Data channel closed');
      };

      // Create offer and set local description
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      const response = await fetch('https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/sdp',
        },
        body: offer.sdp,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
      }

      const answerSdp = await response.text();

      await peerConnectionRef.current.setRemoteDescription({
        type: 'answer',
        sdp: answerSdp,
      });

      // Monitor connection state changes
      peerConnectionRef.current.onconnectionstatechange = () => {
        const state = peerConnectionRef.current.connectionState;

        if (state === 'connected') {
          setIsConnecting(false);
          // Ensure session config is sent if not already sent
          sendSessionConfig();
        } else if (state === 'failed' || state === 'disconnected' || state === 'closed') {
          setError(`Connection ${state}`);
          cleanup();
        }
      };

      peerConnectionRef.current.oniceconnectionstatechange = () => {
        const iceState = peerConnectionRef.current.iceConnectionState;

        if (iceState === 'connected' || iceState === 'completed') {
          // Ensure session config is sent
          sendSessionConfig();
        } else if (iceState === 'failed') {
          setError('ICE connection failed');
          cleanup();
        }
      };

    } catch (err) {
      console.error('❌ Error starting recording:', err);
      setError(`Failed to start: ${err.message}`);
      cleanup();
    }
  }, [isConnecting, disabled, getToken, handleMessage, sendSessionConfig]);

  // Stop recording
  const stopRecording = useCallback(() => {
    cleanup();
  }, []);

  // Cleanup resources
  const cleanup = useCallback(() => {
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    accumulatedLiveTextRef.current = '';
    sessionConfigSentRef.current = false;
    setIsRecording(false);
    setIsConnecting(false);
  }, []);

  // Update committed text when value prop changes
  useEffect(() => {
    if (value !== committedTextRef.current && accumulatedLiveTextRef.current === '') {
      committedTextRef.current = value;
      setCommittedText(value);
      if (textareaRef.current) {
        textareaRef.current.value = value;
      }
    }
  }, [value]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Handle textarea changes
  const handleTextareaChange = (e) => {
    const newValue = e.target.value;
    committedTextRef.current = newValue;
    accumulatedLiveTextRef.current = '';
    setCommittedText(newValue);
    setLiveText('');

    if (onChange) {
      onChange(newValue);
    }
  };

  // Use state values directly for display
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
        style={{
          color: '#374151',
          ...props.style
        }}
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