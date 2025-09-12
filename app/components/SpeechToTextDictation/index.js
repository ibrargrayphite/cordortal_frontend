"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../ui/button';
import styles from './SpeechToTextDictation.module.css';

const SpeechToTextDictation = ({
  value = '',
  onChange,
  placeholder = 'Start speaking or type here...',
  wsUrl,
  autoPostFinals = false,
  apiBase,
  disabled = false,
  className = '',
  ...props
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [liveText, setLiveText] = useState('');
  const [committedText, setCommittedText] = useState(value);
  
  const audioContextRef = useRef(null);
  const audioWorkletNodeRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const websocketRef = useRef(null);
  const isRecordingRef = useRef(false);
  
  // Frame tracking refs
  const framesSinceCommitRef = useRef(0);
  const commitInflightRef = useRef(false);
  const minFramesToCommitRef = useRef(3);
  const frameMsRef = useRef(40);
  
  // Use refs to track current text to avoid stale closures
  const committedTextRef = useRef(value);
  const liveTextRef = useRef('');

  // Generate WebSocket URL
  const getWebSocketUrl = useCallback(() => {
    if (wsUrl) return wsUrl;
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const backendUrl = process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    
    // Remove http/https protocol and add ws/wss
    const cleanUrl = backendUrl.replace(/^https?:\/\//, '');
    return `${protocol}//${cleanUrl}/ws/stt/`;
  }, [wsUrl]);

  // Generate API base URL
  const getApiBase = useCallback(() => {
    if (apiBase) return apiBase;
    return process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
  }, [apiBase]);

  // Safe commit function
  const requestCommit = useCallback((reason) => {
    if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
      console.log('Cannot commit: WebSocket not open');
      return;
    }
    
    if (commitInflightRef.current) {
      console.log('Cannot commit: commit already in flight');
      return;
    }
    
    if (framesSinceCommitRef.current < minFramesToCommitRef.current) {
      console.log(`Cannot commit: only ${framesSinceCommitRef.current} frames, need ${minFramesToCommitRef.current}`);
      return;
    }
    
    console.log(`Committing with reason: ${reason}, frames: ${framesSinceCommitRef.current}`);
    commitInflightRef.current = true;
    websocketRef.current.send(JSON.stringify({ type: 'commit', reason }));
  }, []);

  // Reset commit state
  const resetCommitState = useCallback(() => {
    framesSinceCommitRef.current = 0;
    commitInflightRef.current = false;
  }, []);

  // Cleanup resources
  const cleanup = useCallback(() => {
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (audioWorkletNodeRef.current) {
      audioWorkletNodeRef.current.disconnect();
      audioWorkletNodeRef.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    isRecordingRef.current = false;
    setIsRecording(false);
    setIsConnecting(false);
    resetCommitState();
  }, [resetCommitState]);

  // Start recording
  const startRecording = useCallback(async () => {
    if (isRecordingRef.current || disabled) return;

    try {
      setIsConnecting(true);
      setError(null);

      // Create audio context
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 48000
      });

      // Add audio worklet module
      await audioContextRef.current.audioWorklet.addModule('/speech_to_text/pcm16-worklet.js');

      // Get user media
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000
        }
      });

      // Create audio worklet node
      audioWorkletNodeRef.current = new AudioWorkletNode(audioContextRef.current, 'pcm16-worklet');
      
      // Connect audio
      const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
      source.connect(audioWorkletNodeRef.current);

      // Set up WebSocket
      const wsUrl = getWebSocketUrl();
      websocketRef.current = new WebSocket(wsUrl);
      
      websocketRef.current.binaryType = 'arraybuffer';
      
      websocketRef.current.onopen = () => {
        console.log('WebSocket connected for speech-to-text');
        
        // Send configuration for English language
        if (websocketRef.current.readyState === WebSocket.OPEN) {
          websocketRef.current.send(JSON.stringify({
            type: 'config',
            language: 'en',
            model: 'whisper-1'
          }));
        }
        
        setIsConnecting(false);
        setIsRecording(true);
        isRecordingRef.current = true;
      };

      websocketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          
          switch (data.type) {
            case 'transcript':
              if (data.is_final) {
                // Commit the text - add space before new text if there's existing content
                const currentCommitted = committedTextRef.current;
                const spacePrefix = currentCommitted && !currentCommitted.endsWith('\n') ? ' ' : '';
                const newCommittedText = currentCommitted + spacePrefix + data.text;
                
                console.log('Final transcript - committing:', { 
                  currentCommitted, 
                  newText: data.text, 
                  spacePrefix, 
                  newCommittedText 
                });
                
                // Update refs and state
                committedTextRef.current = newCommittedText;
                liveTextRef.current = '';
                setCommittedText(newCommittedText);
                setLiveText('');
                
                // Update parent component
                if (onChange) {
                  onChange(newCommittedText);
                }
                
                // Reset commit state on final transcript
                resetCommitState();
                
                // Auto-post if enabled
                if (autoPostFinals && data.text.trim()) {
                  postTranscript(data.text);
                }
              } else {
                // Update live text - add space before new text if there's existing content
                const currentCommitted = committedTextRef.current;
                const spacePrefix = currentCommitted && !currentCommitted.endsWith('\n') ? ' ' : '';
                const newLiveText = spacePrefix + data.text;
                
                console.log('Interim transcript - updating live text:', { 
                  currentCommitted, 
                  newText: data.text, 
                  spacePrefix, 
                  newLiveText 
                });
                
                // Update refs and state
                liveTextRef.current = newLiveText;
                setLiveText(newLiveText);
              }
              break;
              
            case 'speech_started':
              console.log('Speech started');
              break;
              
            case 'speech_stopped':
              console.log('Speech stopped');
              // Auto-commit on VAD stop with debounce
              const debounceMs = Math.max(frameMsRef.current, 60); // MIN_COMMIT_MS / 2 = 60ms
              setTimeout(() => {
                requestCommit('vad');
              }, debounceMs);
              break;
              
            case 'input_audio_buffer.committed':
              console.log('Audio buffer committed');
              resetCommitState();
              break;
              
            case 'error':
              console.error('Speech-to-text error:', data.error);
              
              // Ignore harmless commit empty error
              if (data.error && data.error.code === 'input_audio_buffer_commit_empty') {
                console.log('Ignoring harmless commit empty error');
                return;
              }
              
              const errorMessage = typeof data.error === 'object' 
                ? JSON.stringify(data.error) 
                : data.error;
              setError(`Speech recognition error: ${errorMessage}`);
              break;
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      websocketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection error. Please try again.');
        cleanup();
      };

      websocketRef.current.onclose = () => {
        console.log('WebSocket closed');
        cleanup();
      };

      // Handle audio data from worklet
      audioWorkletNodeRef.current.port.onmessage = (event) => {
        if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
          try {
            // Track frames and compute thresholds dynamically on first frame
            if (framesSinceCommitRef.current === 0) {
              const FRAME_SAMPLES = event.data.length;
              const SAMPLE_RATE = Number(process.env.NEXT_PUBLIC_STT_SAMPLE_RATE || 16000);
              const FRAME_MS = (FRAME_SAMPLES / SAMPLE_RATE) * 1000;
              const MIN_COMMIT_MS = Number(process.env.NEXT_PUBLIC_MIN_COMMIT_MS || 120);
              
              frameMsRef.current = FRAME_MS;
              minFramesToCommitRef.current = Math.max(3, Math.ceil(MIN_COMMIT_MS / FRAME_MS));
              
              console.log('Frame tracking initialized:', {
                FRAME_SAMPLES,
                SAMPLE_RATE,
                FRAME_MS,
                MIN_COMMIT_MS,
                minFramesToCommit: minFramesToCommitRef.current
              });
            }
            
            // Check backpressure (1MB threshold)
            if (websocketRef.current.bufferedAmount > 1000000) {
              console.log('WebSocket backpressure detected, skipping frame');
              return;
            }
            
            // Resume sending when backpressure drops below 512KB
            if (websocketRef.current.bufferedAmount < 512000) {
              // Backpressure cleared, continue normal operation
            }
            
            // Send frame and increment counter
            websocketRef.current.send(event.data);
            framesSinceCommitRef.current += 1;
            
          } catch (err) {
            console.error('Error sending audio data:', err);
          }
        }
      };

    } catch (err) {
      console.error('Error starting recording:', err);
      setError(`Failed to start recording: ${err.message}`);
      cleanup();
    }
  }, [committedText, onChange, autoPostFinals, getWebSocketUrl, cleanup, disabled]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (!isRecordingRef.current) return;

    // Request commit with stop reason
    requestCommit('stop');
    
    // Clean up after a short delay
    setTimeout(() => {
      cleanup();
    }, 100);
  }, [requestCommit, cleanup]);

  // Post transcript to API
  const postTranscript = useCallback(async (text) => {
    try {
      const apiBase = getApiBase();
      const response = await fetch(`${apiBase}/api/transcripts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        console.error('Failed to post transcript:', response.statusText);
      }
    } catch (err) {
      console.error('Error posting transcript:', err);
    }
  }, [getApiBase]);

  // Update committed text when value prop changes
  useEffect(() => {
    committedTextRef.current = value;
    setCommittedText(value);
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
    
    // Update refs and state
    committedTextRef.current = newValue;
    liveTextRef.current = '';
    setCommittedText(newValue);
    setLiveText('');
    
    if (onChange) {
      onChange(newValue);
    }
  };

  // Get display text (committed + live) - use refs for real-time updates
  const displayText = committedTextRef.current + liveTextRef.current;

  return (
    <div className={`${styles.container} ${isRecording ? styles.recording : ''} ${className}`}>
      <textarea
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