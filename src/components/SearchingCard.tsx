import { Card } from "@acko/card";
import { Time } from "@acko/icons";
import { Typography } from "@acko/typography";
import { Icon } from "./Icon";

/**
 * "We're working on it" card for the chat. The first line is in progress (spinner), the rest
 * are queued (hollow), and a closing line says when to expect news.
 */
export function SearchingCard({ lines, closing }: { lines: string[]; closing: string }) {
  return (
    <Card variant="secondary" className="reveal-up flex flex-col gap-16 p-16">
      <ul className="flex flex-col gap-12">
        {lines.map((line, i) => (
          <li key={line} className="flex items-start gap-12">
            <span className="mt-0 grid size-24 shrink-0 place-items-center rounded-full border-2 border-border-default-medium" aria-hidden="true">
              {i === 0 ? <span className="spinner" /> : null}
            </span>
            <Typography textStyle="body-md-regular" color={i === 0 ? "primary" : "secondary"}>
              {line}
            </Typography>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-12 border-t border-border-default-soft pt-16">
        <span className="grid size-24 shrink-0 place-items-center text-brand-label-default" aria-hidden="true">
          <Icon icon={Time} size={24} />
        </span>
        <Typography textStyle="body-md-semibold">{closing}</Typography>
      </div>
    </Card>
  );
}
