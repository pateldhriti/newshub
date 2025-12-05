import { useState, useEffect, useCallback } from 'react';

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState('');

  // Check if speech synthesis is supported
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  // Monitor speech synthesis state
  useEffect(() => {
    if (!isSupported) return;

    const handleEnd = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentText('');
    };

    const handleStart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    const handlePause = () => {
      setIsPaused(true);
    };

    const handleResume = () => {
      setIsPaused(false);
    };

    // Note: These events are on the utterance, not speechSynthesis
    // We'll handle them in the speak function
  }, [isSupported]);

  const speak = useCallback((text) => {
    if (!isSupported) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    if (!text || text.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice properties
    utterance.rate = 1.0;  // Speed (0.1 to 10)
    utterance.pitch = 1.0; // Pitch (0 to 2)
    utterance.volume = 1.0; // Volume (0 to 1)

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setCurrentText(text);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentText('');
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentText('');
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  const pause = useCallback(() => {
    if (!isSupported) return;
    
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported) return;
    
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentText('');
  }, [isSupported]);

  const toggle = useCallback((text) => {
    if (isSpeaking) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak(text);
    }
  }, [isSpeaking, isPaused, speak, pause, resume]);

  return {
    speak,
    pause,
    resume,
    stop,
    toggle,
    isSpeaking,
    isPaused,
    isSupported,
    currentText,
  };
};
