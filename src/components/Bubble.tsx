import type { ReactNode } from "react";
import { Typography } from "@acko/typography";

/**
 * One chat message. The customer has a bubble, on the right; the concierge speaks in plain text, on the left.
 * Composed from divs and Typography: the packages have no chat component.
 */
export function Bubble({ from, children, animate = false }: { from: "customer" | "concierge"; children: ReactNode; animate?: boolean }) {
  const enter = animate ? "reveal-up" : "";
  return from === "customer" ? (
    <div className={`${enter} max-w-[88%] self-end rounded-3xl rounded-br-md bg-surface-page-secondary px-16 py-12`}>
      <Typography textStyle="body-md-regular" color="secondary">
        {children}
      </Typography>
    </div>
  ) : (
    <div className={`${enter} max-w-[92%] self-start`}>
      <Typography textStyle="body-lg-regular">{children}</Typography>
    </div>
  );
}

/** Three dots while Otto is writing: no bubble, just the dots on the page. */
export function TypingBubble() {
  return (
    <div className="reveal-up flex w-fit items-center gap-4 py-8" role="status" aria-label="Otto is writing">
      <span className="typing-dot size-6 rounded-full bg-brand-primary500" />
      <span className="typing-dot size-6 rounded-full bg-brand-primary500 [animation-delay:.15s]" />
      <span className="typing-dot size-6 rounded-full bg-brand-primary500 [animation-delay:.3s]" />
    </div>
  );
}
