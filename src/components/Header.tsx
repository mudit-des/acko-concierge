import { Button } from "@acko/button";
import { CustomerService } from "@acko/icons";
import { Typography } from "@acko/typography";
import { asset } from "../asset";
import { Link } from "./Link";

/**
 * Brand header for the home page: ACKO Drive logo, a divider and "Concierge" set at the
 * wordmark's scale, all in one design-system grey. The booking pages use ChatHeader instead.
 */
export function Header() {
  return (
    <header className="flex items-center justify-between gap-8 px-16 pt-[max(12px,env(safe-area-inset-top))]">
      <Link to="/home" className="flex min-h-44 items-center gap-8" aria-label="ACKO Drive concierge home">
        {/* The logo is a mask so it can take the header's grey; the file itself is the black wordmark. */}
        <span
          role="img"
          aria-label="ACKO Drive"
          className="block h-28 w-168 shrink-0"
          style={{
            backgroundColor: "var(--textSecondary)",
            WebkitMaskImage: `url(${asset("/brand/acko-drive-wide-black.svg")})`,
            maskImage: `url(${asset("/brand/acko-drive-wide-black.svg")})`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskPosition: "left center",
            maskPosition: "left center",
          }}
        />
        <span className="h-24 w-1 shrink-0 bg-text-secondary" aria-hidden="true" />
        <Typography textStyle="label-2xl-medium" color="secondary">
          Concierge
        </Typography>
      </Link>
      <span className="[&_button]:text-text-secondary!">
        <Button variant="ghost" iconOnly iconLeft={<CustomerService aria-hidden="true" />} aria-label="Help">
          Help
        </Button>
      </span>
    </header>
  );
}
