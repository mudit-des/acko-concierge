import { useEffect, useRef, useState } from "react";
import { Card } from "@acko/card";
import { Tick } from "@acko/icons";
import { Typography } from "@acko/typography";
import { Icon } from "./Icon";

const STEP_MS = 900;

/**
 * Verification checklist for the chat. Lines tick off one by one, then a final line appears.
 * With reduced motion everything is shown done at once. `skipAnimation` renders the finished state.
 */
export function VerifyCard({
  lines,
  finalLine,
  skipAnimation = false,
  onDone,
}: {
  lines: string[];
  finalLine: string;
  skipAnimation?: boolean;
  onDone: () => void;
}) {
  const [ticked, setTicked] = useState(skipAnimation ? lines.length : 0);
  const [final, setFinal] = useState(skipAnimation);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (skipAnimation) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setTicked(lines.length);
      setFinal(true);
      doneRef.current();
      return;
    }
    const timers: number[] = [];
    lines.forEach((_, i) => timers.push(window.setTimeout(() => setTicked(i + 1), STEP_MS * (i + 1))));
    timers.push(
      window.setTimeout(() => {
        setFinal(true);
        doneRef.current();
      }, STEP_MS * lines.length + 600),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [lines, skipAnimation]);

  return (
    <div aria-live="polite">
    <Card variant="secondary" className="flex flex-col gap-16 p-16">
      <ul className="flex flex-col gap-12">
        {lines.map((line, i) => {
          const done = i < ticked;
          const active = i === ticked && !final;
          return (
            <li key={line} className="flex items-center gap-12">
              <span
                className={`grid size-24 shrink-0 place-items-center rounded-full ${
                  done ? "bg-brand-selection-default text-text-static-light" : "border-2 border-border-default-medium"
                }`}
                aria-hidden="true"
              >
                {done ? <Icon icon={Tick} size={16} /> : active ? <span className="spinner" /> : null}
              </span>
              <Typography textStyle="body-md-regular" color={done ? "primary" : "secondary"}>
                {line}
              </Typography>
            </li>
          );
        })}
      </ul>
      {final && (
        <div className="reveal-up flex items-center gap-12 border-t border-border-default-soft pt-16">
          <span className="grid size-24 shrink-0 place-items-center rounded-full bg-brand-selection-default text-text-static-light" aria-hidden="true">
            <Icon icon={Tick} size={16} />
          </span>
          <Typography textStyle="body-md-semibold" color="brand">
            {finalLine}
          </Typography>
        </div>
      )}
    </Card>
    </div>
  );
}
