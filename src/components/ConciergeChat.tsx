import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@acko/button";
import { ArrowUp, Close } from "@acko/icons";
import { Typography } from "@acko/typography";
import { GREETING, INTENTS, NOTE, START_CHIPS, matchIntent, type Chip, type IntentId } from "../data/chat";
import { navigate } from "../router";
import { Bubble, TypingBubble } from "./Bubble";
import { Mascot } from "./Mascot";

/*
 * The assisted chat: a bottom sheet opened from the nav. It guides with tappable suggestions, takes
 * typed messages too, and can bring in a person at any point. The conversation is scripted for now
 * (see data/chat.ts). The state lives here so closing and reopening keeps the thread.
 */

interface Msg {
  id: number;
  from: "bot" | "user";
  text: string;
  chips?: Chip[];
}

let nextId = 1;
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function ConciergeChat({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([{ id: nextId++, from: "bot", text: GREETING, chips: START_CHIPS }]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the newest message in view; Escape closes; focus the box when the sheet opens.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "end" });
  }, [messages, typing, open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 350);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  const reply = (intent: IntentId) => {
    setTyping(true);
    window.setTimeout(
      () => {
        setTyping(false);
        setMessages((m) => [...m.map((x) => ({ ...x, chips: undefined })), { id: nextId++, from: "bot", text: INTENTS[intent].answer, chips: INTENTS[intent].chips }]);
      },
      reduceMotion() ? 0 : 800,
    );
  };

  const say = (text: string, intent: IntentId) => {
    setMessages((m) => [...m.map((x) => ({ ...x, chips: undefined })), { id: nextId++, from: "user", text }]);
    reply(intent);
  };

  const pick = (chip: Chip) => {
    if (chip.to) {
      onClose();
      navigate(chip.to);
      return;
    }
    say(chip.label, chip.intent ?? "fallback");
  };

  const send = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    say(text, matchIntent(text));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-end justify-center" style={{ zIndex: "var(--zModal)" }} role="dialog" aria-modal="true" aria-label="Chat with your concierge">
      <div className="chat-backdrop absolute inset-0 bg-text-primary/40" onClick={onClose} aria-hidden="true" />
      <div className="chat-sheet relative flex h-[92svh] w-full max-w-480 flex-col overflow-hidden rounded-t-[32px] bg-surface-page-primary shadow-l">
        <header className="flex items-center gap-12 border-b border-border-default-soft px-16 py-12">
          <span className="relative shrink-0" aria-hidden="true">
            <span className="grid size-44 place-items-center overflow-hidden rounded-full bg-brand-surface-subtle">
              <Mascot mood={typing ? "thinking" : "happy"} talking={typing} size={40} className="mt-4" />
            </span>
            <span className="absolute right-0 bottom-0 size-12 rounded-full border-2 border-surface-page-primary bg-surface-status-success" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <Typography textStyle="label-lg-semibold" truncate>
              Your concierge
            </Typography>
            <Typography textStyle="helper-sm-regular" color="secondary" truncate>
              {NOTE}
            </Typography>
          </div>
          <span className="[&_button]:text-text-primary!">
            <Button variant="ghost" size="md" iconOnly iconLeft={<Close aria-hidden="true" />} aria-label="Close chat" onClick={onClose}>
              Close
            </Button>
          </span>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-16 py-16" aria-live="polite">
          {messages.map((m) => (
            <div key={m.id} className="flex flex-col gap-8">
              <Bubble from={m.from === "user" ? "customer" : "concierge"} animate>
                {m.text}
              </Bubble>
              {m.chips && (
                <div className="reveal-up flex flex-wrap gap-8">
                  {m.chips.map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => pick(c)}
                      className="min-h-44 rounded-full border border-border-default-medium bg-surface-card-default px-16 text-left active:scale-[0.98]"
                    >
                      <Typography textStyle="body-md-medium" as="span">
                        {c.label}
                      </Typography>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {typing && <TypingBubble />}
          <div ref={endRef} />
        </div>

        <form onSubmit={send} className="flex items-center gap-8 border-t border-border-default-soft px-12 pt-8 pb-[max(12px,env(safe-area-inset-bottom))]">
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask your concierge"
            aria-label="Message your concierge"
            className="h-48 min-w-0 flex-1 rounded-full border border-border-default-medium bg-surface-card-default px-20 text-[16px] text-text-primary outline-none placeholder:text-text-muted focus:border-text-primary"
          />
          <Button type="submit" size="md" iconOnly iconLeft={<ArrowUp aria-hidden="true" />} aria-label="Send" disabled={!draft.trim()}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
