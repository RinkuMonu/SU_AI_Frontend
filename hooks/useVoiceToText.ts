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

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  // Check support on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      setIsSupported(Boolean(SpeechRecognition));
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
    if (globalStopActiveSession === stopListening) {
      globalStopActiveSession = null;
    }
    setIsListening(false);
    setInterimTranscript("");
  }, []);

  const startListening = useCallback(
    (overrideLang?: VoiceLanguage) => {
      setError(null);
      isStoppingIntentionallyRef.current = false;

      if (typeof window === "undefined") return;

      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setIsSupported(false);
        setError("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
        return;
      }

      // Stop any other active voice recognition session first
      if (globalStopActiveSession && globalStopActiveSession !== stopListening) {
        globalStopActiveSession();
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

        let accumulatedFinal = "";

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
          globalStopActiveSession = stopListening;
        };

        recognition.onresult = (event: any) => {
          let currentInterim = "";

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              accumulatedFinal += transcript;
            } else {
              currentInterim += transcript;
            }
          }

          setInterimTranscript(currentInterim);

          const base = baseTextRef.current.trim();
          const spoken = (accumulatedFinal + (currentInterim ? " " + currentInterim : "")).trim();

          let combined = base;
          if (spoken) {
            combined = base ? `${base} ${spoken}` : spoken;
          }

          if (onTranscriptRef.current) {
            onTranscriptRef.current(combined, false);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          if (isStoppingIntentionallyRef.current) return;

          switch (event.error) {
            case "not-allowed":
            case "permission-denied":
              setError("Microphone permission denied. Please allow microphone access in your browser.");
              break;
            case "no-speech":
              // Quiet timeout - do not show scary red error for brief silence
              break;
            case "audio-capture":
              setError("No microphone detected. Please check your audio input device.");
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
          if (globalStopActiveSession === stopListening) {
            globalStopActiveSession = null;
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err: any) {
        console.error("Failed to start speech recognition:", err);
        setError("Could not start microphone. Please try again.");
        setIsListening(false);
      }
    },
    [currentValue, lang, stopListening]
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
    interimTranscript,
    startListening,
    stopListening,
    toggleListening,
  };
}

