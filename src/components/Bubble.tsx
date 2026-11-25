import type { ReactNode } from "react";
import { Typography } from "@acko/typography";

/**
 * One chat bubble. The customer sits right, the concierge left, as in any chat.
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
    <div className={`${enter} max-w-[88%] self-start rounded-3xl rounded-bl-md bg-brand-surface-subtle px-16 py-12`}>
      <Typography textStyle="body-md-medium">{children}</Typography>
    </div>
  );
}

/** Three-dot "concierge is writing" bubble. */
export function TypingBubble() {
  return (
    <div className="reveal-up flex w-fit items-center gap-4 self-start rounded-3xl rounded-bl-md bg-brand-surface-subtle px-16 py-16" role="status" aria-label="Concierge is writing">
      <span className="typing-dot size-6 rounded-full bg-brand-primary500" />
      <span className="typing-dot size-6 rounded-full bg-brand-primary500 [animation-delay:.15s]" />
      <span className="typing-dot size-6 rounded-full bg-brand-primary500 [animation-delay:.3s]" />
    </div>
  );
}
