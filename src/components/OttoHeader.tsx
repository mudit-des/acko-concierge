import { Button } from "@acko/button";
import { ArrowLeft, CustomerService } from "@acko/icons";
import { Typography } from "@acko/typography";
import { asset } from "../asset";
import { CONCIERGE_NAME } from "../data/booking";
import { Mascot, type MascotMood } from "./Mascot";

/*
 * The top of every screen with Otto: the mascot, "Otto by ACKO Drive" and, where a page wants them,
 * Back on the left and "Get help" on the right. One line, the same everywhere, no scroll behaviour.
 */

export function OttoHeader({
  mood = "happy",
  talking = false,
  onBack,
  onHelp,
}: {
  mood?: MascotMood;
  talking?: boolean;
  onBack?: () => void;
  onHelp?: () => void;
}) {
  return (
    <div
      className={`flex min-h-44 items-center gap-4 [&_button]:text-text-primary! ${onBack ? "-ml-8" : ""} ${onHelp ? "-mr-8" : ""}`}
    >
      {onBack && (
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          iconLeft={<ArrowLeft aria-hidden="true" />}
          aria-label="Back"
          onClick={onBack}
        >
          Back
        </Button>
      )}
      <div className="flex min-w-0 flex-1 items-center gap-8">
        <span className="relative shrink-0" aria-hidden="true">
          <span className="grid size-32 place-items-center overflow-hidden rounded-full bg-brand-surface-subtle">
            <Mascot mood={mood} talking={talking} size={28} className="mt-2" />
          </span>
          <span className="absolute right-0 bottom-0 size-10 rounded-full border-2 border-surface-page-primary bg-surface-status-success" />
        </span>
        <Typography textStyle="label-lg-semibold" as="h1">
          {CONCIERGE_NAME}
        </Typography>
        <Typography textStyle="body-md-regular" color="secondary" as="span">
          by
        </Typography>
        <img
          src={asset("/brand/acko-drive-wide-green.svg")}
          alt="ACKO Drive"
          height={16}
          className="h-16 w-auto"
        />
      </div>
      {onHelp && (
        <Button
          variant="ghost"
          size="sm"
          iconLeft={<CustomerService aria-hidden="true" />}
          onClick={onHelp}
        >
          Get help
        </Button>
      )}
    </div>
  );
}
