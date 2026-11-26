import { useEffect, useState } from "react";
import { Typography } from "@acko/typography";
import type { IntentId } from "../data/chat";
import { Mascot } from "./Mascot";

/*
 * The top of the home page, written as a conversation: the concierge says hello and invites a question.
 * A few suggestions open the chat with that topic already sent. The ask bar itself sits fixed at the bottom of the screen.
 */

const SUGGESTIONS: { label: string; intent: IntentId }[] = [
  { label: "Buy a car", intent: "buy" },
  { label: "Renew my insurance", intent: "insurance" },
  { label: "My car broke down", intent: "claim" },
  { label: "Check challans", intent: "challans" },
];

export function Hero({ onAsk }: { onAsk: (text: string, intent: IntentId) => void }) {
  const [talking, setTalking] = useState(true);

  // The concierge "speaks" for a moment when the page opens.
  useEffect(() => {
    const t = window.setTimeout(() => setTalking(false), 2200);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section className="flex flex-col gap-12 px-16 pt-16 pb-8" aria-labelledby="hero-title">
      <span className="relative w-fit" aria-hidden="true">
        <span className="grid size-64 place-items-center overflow-hidden rounded-full bg-brand-surface-subtle">
          <Mascot mood="happy" talking={talking} size={60} className="mt-4" />
        </span>
        <span className="absolute right-2 bottom-2 size-14 rounded-full border-2 border-surface-page-primary bg-surface-status-success" />
      </span>

      <div className="reveal-up max-w-[92%] self-start rounded-3xl rounded-bl-md bg-brand-surface-subtle px-16 py-12">
        <Typography textStyle="heading-lg" as="h1" id="hero-title">
          Hey, this is your concierge.
        </Typography>
      </div>
      <div className="reveal-up max-w-[92%] self-start rounded-3xl rounded-bl-md bg-brand-surface-subtle px-16 py-12" style={{ animationDelay: "250ms" }}>
        <Typography textStyle="body-lg-medium">Ask me anything about your car. We&rsquo;ll get back to you.</Typography>
      </div>

      <div className="reveal-up flex flex-wrap gap-8" style={{ animationDelay: "450ms" }}>
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => onAsk(s.label, s.intent)}
            className="min-h-44 rounded-full border border-border-default-medium bg-surface-card-default px-16 active:scale-[0.98]"
          >
            <Typography textStyle="body-md-medium" as="span">
              {s.label}
            </Typography>
          </button>
        ))}
      </div>
    </section>
  );
}
