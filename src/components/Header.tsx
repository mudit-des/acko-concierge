import { asset } from "../asset";
import { Link } from "./Link";

/**
 * Top of the home page: just the ACKO Drive logo in its green mark with a dark wordmark, small, with no bar around it. It scrolls away with the page.
 * The way to the concierge is the ask bar fixed at the bottom of the screen.
 */
export function Header() {
  return (
    <header className="px-20 pt-[max(20px,env(safe-area-inset-top))] pb-4">
      <Link to="/home" className="inline-flex min-h-44 items-center" aria-label="ACKO Drive home">
        <img src={asset("/brand/acko-drive-wide-green.svg")} alt="ACKO Drive" height={20} className="h-20 w-auto" />
      </Link>
    </header>
  );
}
