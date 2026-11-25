import { useEffect, useState } from "react";
import { Button } from "@acko/button";
import { Messages } from "@acko/icons";
import { Typography } from "@acko/typography";
import { asset } from "../asset";
import { Link } from "./Link";

/**
 * Nav for the home page, a floating pill: the ACKO Drive wordmark, "Concierge" in lighter grey,
 * and one black button to talk to the concierge. At the top of the page it sits at the top; once
 * you scroll it travels down and docks at the bottom of the screen, where it replaces the old
 * "Talk to your concierge" bar, since the two were the same thing.
 */
const PILL_HEIGHT = 56;
const EASE = "cubic-bezier(.22,.8,.2,1)";

export function Header() {
  const [docked, setDocked] = useState(false);
  useEffect(() => {
    const on = () => setDocked(window.scrollY > 80);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      {/* Keeps the page content clear of the pill while it sits at the top. */}
      <div style={{ height: `calc(${PILL_HEIGHT}px + max(16px, env(safe-area-inset-top)))` }} aria-hidden="true" />
      <header
        className="pointer-events-none fixed inset-x-0 top-0"
        style={{
          zIndex: "var(--zSticky)",
          transform: docked
            ? `translateY(calc(100svh - ${PILL_HEIGHT}px - max(16px, env(safe-area-inset-bottom))))`
            : "translateY(max(8px, env(safe-area-inset-top)))",
          transition: `transform 600ms ${EASE}`,
        }}
      >
        <div className="pointer-events-auto mx-auto w-full max-w-480 px-16">
          <div
            className="flex items-center gap-8 rounded-full border border-border-default-soft bg-surface-card-default/90 py-4 pr-4 pl-20 shadow-m backdrop-blur-md"
            style={{ height: PILL_HEIGHT }}
          >
            <Link to="/home" className="flex min-h-44 min-w-0 items-center gap-6" aria-label="ACKO Drive concierge home">
              <img src={asset("/brand/acko-drive-wide-black.svg")} alt="ACKO Drive" height={24} className="h-24 w-auto shrink-0" />
              <Typography textStyle="label-xl-medium" color="secondary" truncate>
                Concierge
              </Typography>
            </Link>
            <span className="ml-auto">
              <Button size="md" iconOnly iconLeft={<Messages aria-hidden="true" />} aria-label="Talk to your concierge">
                Talk to your concierge
              </Button>
            </span>
          </div>
        </div>
      </header>
    </>
  );
}
