import { useEffect, useRef, useState } from "react";
import { Microphone } from "@acko/icons";
import { Icon } from "./Icon";

/*
 * Voice input for the chat: a round mic button that uses the browser's speech recognition (Chrome, Edge, Safari).
 * It types what you say into the message box; you still tap send. Where the browser has no speech recognition,
 * the button is not shown at all.
 */

interface Recognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult:
    | ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void)
    | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}
type RecognitionCtor = new () => Recognition;

const getCtor = (): RecognitionCtor | undefined => {
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
};

export function MicButton({
  className = "",
  onStart,
  onTranscript,
  onListeningChange,
}: {
  /** Size, borders and grid placement are the caller's. */
  className?: string;
  /** Called when listening begins, so the caller can remember what is already typed. */
  onStart?: () => void;
  /** The whole transcript so far, updated as the person speaks. */
  onTranscript: (text: string) => void;
  onListeningChange?: (listening: boolean) => void;
}) {
  const [listening, setListening] = useState(false);
  const rec = useRef<Recognition | null>(null);
  const Ctor = getCtor();

  const set = (v: boolean) => {
    setListening(v);
    onListeningChange?.(v);
  };

  useEffect(() => () => rec.current?.abort(), []);

  if (!Ctor) return null;

  const toggle = () => {
    if (listening) {
      rec.current?.stop();
      return;
    }
    const r = new Ctor();
    r.lang = "en-IN";
    r.interimResults = true;
    r.continuous = false;
    r.onresult = (e) => {
      let t = "";
      for (let i = 0; i < e.results.length; i++)
        t += e.results[i][0].transcript;
      onTranscript(t.trim());
    };
    r.onend = () => set(false);
    r.onerror = () => set(false);
    rec.current = r;
    onStart?.();
    try {
      r.start();
      set(true);
    } catch {
      set(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={listening}
      aria-label={listening ? "Stop listening" : "Speak your message"}
      className={`${className} [@media(hover:hover)]:hover:bg-[var(--brandPrimary100)]`}
      style={{
        color: listening ? "var(--brandPrimary600)" : "var(--textSecondary)",
        backgroundColor: listening ? "var(--brandPrimary100)" : undefined,
      }}
    >
      <Icon icon={Microphone} size={24} />
    </button>
  );
}
