"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type VoiceLanguage = "en-IN" | "hi-IN";

interface UseVoiceToTextOptions {
  onTranscript?: (text: string, isFinal: boolean) => void;
  currentValue?: string;
  defaultLang?: VoiceLanguage;
}

// Global reference to ensure only ONE microphone session is active across the app at any given time
let globalStopActiveSession: (() => void) | null = null;

export function useVoiceToText({
  onTranscript,
  currentValue = "",
  defaultLang = "en-IN",
}: UseVoiceToTextOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [lang, setLang] = useState<VoiceLanguage>(defaultLang);
  const [error, setError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState("");

  const recognitionRef = useRef<any>(null);
  const baseTextRef = useRef<string>("");
  const onTranscriptRef = useRef(onTranscript);
  const isStoppingIntentionallyRef = useRef(false);
  const activeMediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  // Check Web Speech API support on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      setIsSupported(Boolean(SpeechRecognition));
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const releaseMediaStream = useCallback(() => {
    if (activeMediaStreamRef.current) {
      try {
        activeMediaStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch (_) {}
      activeMediaStreamRef.current = null;
    }
  }, []);

  const stopListening = useCallback(() => {
    isStoppingIntentionallyRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      recognitionRef.current = null;
    }
    releaseMediaStream();
    if (globalStopActiveSession === stopListening) {
      globalStopActiveSession = null;
    }
    setIsListening(false);
    setInterimTranscript("");
  }, [releaseMediaStream]);

  const startListening = useCallback(
    async (overrideLang?: VoiceLanguage) => {
      setError(null);
      isStoppingIntentionallyRef.current = false;

      if (typeof window === "undefined") return;

      const isLocalHostOrSecure = Boolean(
        window.isSecureContext ||
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.protocol === "https:"
      );

      if (!isLocalHostOrSecure) {
        setError(
          "Microphone requires a secure connection (HTTPS or http://localhost:3000). Please open via localhost or HTTPS."
        );
        return;
      }

      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setIsSupported(false);
        setError("Speech recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari.");
        return;
      }

      // Stop any other active voice recognition session across the app
      if (globalStopActiveSession && globalStopActiveSession !== stopListening) {
        try {
          globalStopActiveSession();
        } catch (_) {}
      }

      // Snapshot current value as base text so user speech appends seamlessly
      baseTextRef.current = currentValue || "";

      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        const activeLang = overrideLang || lang;
        recognition.lang = activeLang;

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
          globalStopActiveSession = stopListening;
        };

        recognition.onresult = (event: any) => {
          let finalTranscript = "";
          let currentInterim = "";

          // Accurately accumulate from index 0 across all results
          for (let i = 0; i < event.results.length; ++i) {
            const item = event.results[i];
            const textPiece = item[0]?.transcript || "";
            if (item.isFinal) {
              finalTranscript += textPiece;
            } else {
              currentInterim += textPiece;
            }
          }

          setInterimTranscript(currentInterim);

          const base = baseTextRef.current.trim();
          const spoken = (finalTranscript + (currentInterim ? " " + currentInterim : "")).trim();

          let combined = base;
          if (spoken) {
            combined = base ? `${base} ${spoken}` : spoken;
          }

          if (onTranscriptRef.current) {
            onTranscriptRef.current(combined, false);
          }
        };

        recognition.onerror = (event: any) => {
          if (isStoppingIntentionallyRef.current) return;

          switch (event.error) {
            case "not-allowed":
            case "permission-denied":
              setError("Microphone permission denied. Please click the site settings / lock icon (🔒) in your browser address bar and allow Microphone access.");
              break;
            case "no-speech":
              // Silence timeout - non-fatal
              break;
            case "audio-capture":
              setError("No microphone detected. Please plug in or connect an audio input device.");
              break;
            case "network":
              setError("Network error connecting to speech recognition service.");
              break;
            default:
              setError(`Voice input notice: ${event.error}`);
          }
          stopListening();
        };

        recognition.onend = () => {
          setIsListening(false);
          setInterimTranscript("");
          releaseMediaStream();
          if (globalStopActiveSession === stopListening) {
            globalStopActiveSession = null;
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err: any) {
        console.error("Failed to start speech recognition:", err);
        setError("Could not start microphone. Please check browser permissions and try again.");
        setIsListening(false);
        releaseMediaStream();
      }
    },
    [currentValue, lang, stopListening, releaseMediaStream]
  );

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    isListening,
    isSupported,
    lang,
    setLang,
    error,
    clearError,
    interimTranscript,
    startListening,
    stopListening,
    toggleListening,
  };
}
