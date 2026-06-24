"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  onTranscript: (text: string) => void;
  onStateChange?: (recording: boolean) => void;
};

/**
 * Voice input via the Web Speech API (Chrome, Edge, Safari).
 * Interim results stream into the answer as the user speaks.
 */
export default function VoiceButton({ onTranscript, onStateChange }: Props) {
  const [supported, setSupported] = useState(true);
  const [recording, setRecording] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recRef = useRef<any>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
      }
      if (final.trim()) onTranscript(final.trim());
    };
    rec.onend = () => {
      setRecording(false);
      onStateChange?.(false);
    };
    rec.onerror = () => {
      setRecording(false);
      onStateChange?.(false);
    };
    recRef.current = rec;
    return () => {
      try {
        rec.stop();
      } catch {
        /* already stopped */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle() {
    const rec = recRef.current;
    if (!rec) return;
    if (recording) {
      rec.stop();
    } else {
      try {
        rec.start();
        setRecording(true);
        onStateChange?.(true);
      } catch {
        /* start() throws if already started */
      }
    }
  }

  if (!supported) {
    return (
      <span className="text-xs italic text-ink-faint">
        Voice input needs Chrome, Edge, or Safari
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={recording}
      aria-label={recording ? "Stop voice input" : "Answer by voice"}
      className={`font-display inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full border-[3px] border-ink px-5 py-2 text-sm font-semibold transition-colors duration-200 ${
        recording
          ? "recording bg-sienna text-cloud"
          : "bg-sky text-ink hover:bg-gold"
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" />
        <path d="M19 11a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.94V23h2v-3.06A9 9 0 0 0 21 11h-2Z" />
      </svg>
      {recording ? "Listening… tap to stop" : "Answer by voice"}
    </button>
  );
}
