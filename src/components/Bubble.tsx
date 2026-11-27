import type { ReactNode } from "react";
import { Typography } from "@acko/typography";

/**
 * One chat message. The customer has a grey bubble on the right; Otto has a pale sage bubble that runs the full width between the page margins.
 * Otto is already shown in the top bar of every screen, so his messages carry no avatar of their own.
 * Composed from divs and Typography: the packages have no chat component.
 */

const SAGE = "var(--brandPrimary100)";

export function Bubble({
  from,
  children,
  animate = false,
}: {
  from: "customer" | "concierge";
  children: ReactNode;
  animate?: boolean;
}) {
  const enter = animate ? "reveal-up" : "";
  if (from === "customer") {
    return (
      <div
        className={`${enter} max-w-[88%] self-end rounded-3xl rounded-br-md bg-surface-page-secondary px-16 py-12`}
      >
        <Typography textStyle="body-md-regular" color="secondary">
          {children}
        </Typography>
      </div>
    );
  }
  return (
    <div
      className={`${enter} w-full self-stretch rounded-3xl px-16 py-12`}
      style={{ backgroundColor: SAGE }}
    >
      <Typography textStyle="body-lg-regular">{children}</Typography>
    </div>
  );
}

/** Three dots while Otto is writing, in the same bubble as his messages. */
export function TypingBubble() {
  return (
    <div
      className="reveal-up flex w-fit items-center gap-4 self-start rounded-3xl px-16 py-16"
      style={{ backgroundColor: SAGE }}
      role="status"
      aria-label="Otto is writing"
    >
      <span className="typing-dot size-6 rounded-full bg-brand-primary500" />
      <span className="typing-dot size-6 rounded-full bg-brand-primary500 [animation-delay:.15s]" />
      <span className="typing-dot size-6 rounded-full bg-brand-primary500 [animation-delay:.3s]" />
    </div>
  );
}
