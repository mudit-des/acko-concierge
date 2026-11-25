import { Typography } from "@acko/typography";
import { ChevronRight } from "@acko/icons";
import { STAGES, STEPS, stageTarget } from "../data/booking";

/**
 * The booking's open timeline. Done steps are solid sage, the current one has a ring and a soft
 * halo, upcoming ones are hollow on a dotted line. Shared by the first-screen bubble and the
 * expandable pinned card. With `onSelect`, finished and current steps are buttons that jump to that
 * step's update in the chat.
 */
export function StepsTimeline({ stage, allDone = false, onSelect }: { stage: number; allDone?: boolean; onSelect?: (stage: number) => void }) {
  return (
    <ol className="flex flex-col">
      {STAGES.map((s, i) => {
        const done = i < stage || (allDone && i === stage);
        const now = i === stage && !allDone;
        const last = i === STAGES.length - 1;
        return (
          <li key={s.title} className="flex gap-16" aria-current={now ? "step" : undefined}>
            <div className="flex w-16 shrink-0 flex-col items-center">
              <span className="flex h-24 items-center">
                {done ? (
                  <span className="size-12 rounded-full bg-brand-selection-default" />
                ) : now ? (
                  <span className="node-halo relative size-16 rounded-full border-2 border-brand-selection-default bg-surface-card-default" />
                ) : (
                  <span className="size-12 rounded-full border-2 border-border-default-medium bg-surface-card-default" />
                )}
              </span>
              {!last && (
                <span
                  className={`my-4 min-h-24 w-0 flex-1 border-l-2 ${done ? "border-solid border-brand-selection-default" : "border-dotted border-brand-primary300"}`}
                  aria-hidden="true"
                />
              )}
            </div>
            {(() => {
              const tappable = Boolean(onSelect) && (done || now);
              const body = (
                <>
                  <div className="flex items-center gap-8">
                    <Typography textStyle="body-md-semibold" as="h3">
                      {s.title}
                    </Typography>
                    {now && (
                      <Typography textStyle="label-sm-semibold" color="brand">
                        Now
                      </Typography>
                    )}
                    {done && onSelect && (
                      <Typography textStyle="label-sm-semibold" color="secondary">
                        Done
                      </Typography>
                    )}
                    {tappable && (
                      <span className="ml-auto text-text-secondary [&_svg]:size-16" aria-hidden="true">
                        <ChevronRight />
                      </span>
                    )}
                  </div>
                  <Typography textStyle="body-md-regular" color="secondary">
                    {s.line}
                  </Typography>
                  {done && onSelect && (
                    <Typography textStyle="helper-sm-regular" color="secondary">
                      {STEPS[stageTarget(i)]?.time}
                    </Typography>
                  )}
                </>
              );
              const cls = `flex min-w-0 flex-1 flex-col gap-4 text-left ${last ? "" : "pb-24"} ${!done && !now ? "opacity-75" : ""}`;
              return tappable ? (
                <button type="button" className={`${cls} cursor-pointer`} onClick={() => onSelect!(i)} aria-label={`${s.title}. Go to this update`}>
                  {body}
                </button>
              ) : (
                <div className={cls}>{body}</div>
              );
            })()}
          </li>
        );
      })}
    </ol>
  );
}
