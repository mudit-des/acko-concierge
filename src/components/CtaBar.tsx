import { Button } from "@acko/button";
import { Messages } from "@acko/icons";

/** Sticky bottom action. One primary action per screen (layout.md). */
export function CtaBar({ label = "Talk to your concierge" }: { label?: string }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 pt-32"
      style={{
        zIndex: "var(--zSticky)",
        background: "linear-gradient(180deg, transparent 0%, var(--surfacePagePrimary) 40%)",
      }}
    >
      <div className="pointer-events-auto mx-auto w-full max-w-480 px-16 pb-[max(16px,env(safe-area-inset-bottom))]">
        <Button size="md" fullWidth iconLeft={<Messages aria-hidden="true" />}>
          {label}
        </Button>
      </div>
    </div>
  );
}
