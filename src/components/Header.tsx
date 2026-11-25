import { Button } from "@acko/button";
import { Messages } from "@acko/icons";
import { Typography } from "@acko/typography";
import { asset } from "../asset";
import { Link } from "./Link";

/**
 * Top nav for the services page, a floating pill that stays at the top: the ACKO Drive wordmark,
 * "Concierge" in lighter grey, and a quiet icon to talk to the concierge.
 */
export function Header() {
  return (
    <header className="sticky top-0 px-16 pt-[max(8px,env(safe-area-inset-top))] pb-8" style={{ zIndex: "var(--zSticky)" }}>
      <div className="flex h-56 items-center gap-8 rounded-full border border-border-default-soft bg-surface-card-default/90 py-4 pr-4 pl-20 shadow-m backdrop-blur-md">
        <Link to="/home" className="flex min-h-44 min-w-0 items-center gap-6" aria-label="ACKO Drive concierge home">
          <img src={asset("/brand/acko-drive-wide-black.svg")} alt="ACKO Drive" height={24} className="h-24 w-auto shrink-0" />
          <Typography textStyle="label-xl-medium" color="secondary" truncate>
            Concierge
          </Typography>
        </Link>
        <span className="ml-auto [&_button]:text-text-primary!">
          <Button variant="ghost" size="md" iconOnly iconLeft={<Messages aria-hidden="true" />} aria-label="Talk to your concierge">
            Talk to your concierge
          </Button>
        </span>
      </div>
    </header>
  );
}
