import { useState } from "react";
import { Button } from "@acko/button";
import { Drawer } from "@acko/drawer";
import { CustomerService } from "@acko/icons";
import { Typography } from "@acko/typography";
import { Icon } from "./Icon";

/*
 * The call button: a round icon button that sits beside the main action at the bottom of a screen, like
 * the menu button beside the chat input. It opens the "Need a hand?" sheet, where a call-back can be requested.
 */
export function HelpButton() {
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Get help"
        className="grid size-48 shrink-0 place-items-center rounded-full border border-border-default-medium bg-surface-card-default text-text-primary transition-transform active:scale-[0.96]"
      >
        <Icon icon={CustomerService} size={24} />
      </button>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="bottom"
        title="Need a hand?"
        description={
          requested
            ? "Done. We'll call you shortly."
            : "We can call you back, usually within a few minutes."
        }
        footer={
          <Button
            size="md"
            fullWidth
            disabled={requested}
            onClick={() => setRequested(true)}
          >
            {requested ? "Call-back requested" : "Request a call-back"}
          </Button>
        }
      >
        <div className="pb-8">
          <Typography textStyle="body-md-regular" color="secondary">
            You can also keep going here. Your concierge will see everything
            you've done so far.
          </Typography>
        </div>
      </Drawer>
    </>
  );
}
