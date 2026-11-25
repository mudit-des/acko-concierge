import { Button } from "@acko/button";
import { CustomerService } from "@acko/icons";
import { Typography } from "@acko/typography";
import { asset } from "../asset";
import { Link } from "./Link";

/**
 * Header for the home page: the same floating pill as the buy pages. The ACKO Drive wordmark in
 * solid black, then "Concierge" in a lighter grey on the same line with no divider, and help on
 * the right. It stays pinned while the page scrolls.
 */
export function Header() {
  return (
    <header className="sticky top-0 px-16 pt-[max(8px,env(safe-area-inset-top))] pb-8" style={{ zIndex: "var(--zSticky)" }}>
      <div className="flex items-center gap-8 rounded-full border border-border-default-soft bg-surface-card-default/90 py-4 pr-4 pl-20 shadow-m backdrop-blur-md [&_button]:text-text-primary!">
        <Link to="/home" className="flex min-h-44 min-w-0 items-center gap-6" aria-label="ACKO Drive concierge home">
          <img src={asset("/brand/acko-drive-wide-black.svg")} alt="ACKO Drive" height={24} className="h-24 w-auto shrink-0" />
          <Typography textStyle="label-xl-medium" color="secondary" truncate>
            Concierge
          </Typography>
        </Link>
        <span className="ml-auto">
          <Button variant="ghost" size="sm" iconOnly iconLeft={<CustomerService aria-hidden="true" />} aria-label="Get help">
            Get help
          </Button>
        </span>
      </div>
    </header>
  );
}
