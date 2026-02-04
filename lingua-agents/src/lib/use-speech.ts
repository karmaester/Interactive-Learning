"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { Language } from "@/lib/types";

// BCP-47 language tags for Web Speech APIs
const SPEECH_LANG: Record<Language, string> = {
  en: "en-US",
  es: "es-ES",
  de: "de-DE",
};

// --- Speech Recognition (voice input) ---

interface UseSpeechRecognitionOptions {
  language: Language | null;
  onResult: (transcript: string) => void;
  onInterimResult?: (transcript: string) => void;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type SpeechRecognitionInstance = any;

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === "undefined") return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

export function useSpeechRecognition({
  language,
  onResult,
  onInterimResult,
}: UseSpeechRecognitionOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    setIsSupported(!!getSpeechRecognitionCtor());
  }, []);

  const startListening = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor || !language) return;

    const recognition = new Ctor();
    recognition.lang = SPEECH_LANG[language];
    recognition.interimResults = !!onInterimResult;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      if (finalTranscript) {
        onResult(finalTranscript);
      } else if (interimTranscript && onInterimResult) {
        onInterimResult(interimTranscript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [language, onResult, onInterimResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return { isListening, isSupported, startListening, stopListening, toggleListening };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// --- Speech Synthesis (text-to-speech) ---

interface UseSpeechSynthesisOptions {
  language: Language | null;
}

export function useSpeechSynthesis({ language }: UseSpeechSynthesisOptions) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!language || typeof window === "undefined" || !window.speechSynthesis)
        return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Clean text of markdown/correction markers
      const cleanText = text
        .replace(/\[CORRECTION:[^\]]+\]/g, "")
        .replace(/\[VOCAB\][^[]*\[\/VOCAB\]/g, "")
        .replace(/\[IDIOM\][^[]*\[\/IDIOM\]/g, "")
        .replace(/\[REVIEW RESULT\][^[]*\[\/REVIEW RESULT\]/g, "")
        .replace(/\*[^*]+\*/g, "")
        .replace(/#{1,6}\s/g, "")
        .replace(/```[^`]*```/g, "")
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = SPEECH_LANG[language];
      utterance.rate = 0.9;
      utterance.pitch = 1;

      // Try to find a voice matching the language
      const voices = window.speechSynthesis.getVoices();
      const langPrefix = SPEECH_LANG[language].split("-")[0];
      const matchingVoice = voices.find((v) => v.lang.startsWith(langPrefix));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [language]
  );

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  return { isSpeaking, isSupported, speak, stop };
}
