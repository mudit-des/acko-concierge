import type { ReactNode } from "react";
import { Card } from "@acko/card";
import { Typography } from "@acko/typography";
import { Link } from "../components/Link";
import { DOCUMENTS_PATH, STEPS } from "../data/booking";

/*
 * Reviewer index: one link per screen so any state can be opened directly.
 * Temporary, like the style guide.
 */

interface Row {
  path: string;
  title: string;
  summary: string;
}

const DOCUMENTS_ROW: Row = {
  path: DOCUMENTS_PATH,
  title: "Upload documents",
  summary: "Aadhaar and PAN rows, the quick check, the privacy line.",
};

// Documents upload sits between "Booked" and "Documents received".
const ROWS: Row[] = [
  ...STEPS.slice(0, 1).map((s) => ({
    path: s.path,
    title: s.title,
    summary: s.summary,
  })),
  DOCUMENTS_ROW,
  ...STEPS.slice(1).map((s) => ({
    path: s.path,
    title: s.title,
    summary: s.summary,
  })),
];

const EXTRA: Row[] = [
  {
    path: "/buy-car/finance?choice=us",
    title: "Choose how to pay: finance through us",
    summary: "The finance page with the customer's reply shown.",
  },
  {
    path: "/buy-car/finance?choice=bank",
    title: "Choose how to pay: own bank",
    summary: "The finance page with the own-bank reply shown.",
  },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-12 px-16 pt-32">
      <Typography textStyle="heading-md" as="h2">
        {title}
      </Typography>
      <div className="flex flex-col gap-8">{children}</div>
    </section>
  );
}

function Item({ row, n }: { row: Row; n?: number }) {
  return (
    <Link to={row.path} className="block rounded-5xl">
      <Card variant="secondary" className="flex items-start gap-12 p-16">
        {n !== undefined && (
          <span className="grid size-24 shrink-0 place-items-center rounded-full bg-brand-surface-subtle">
            <Typography textStyle="label-sm-semibold" color="brand">
              {n}
            </Typography>
          </span>
        )}
        <div className="flex min-w-0 flex-col gap-4">
          <Typography textStyle="body-md-semibold">{row.title}</Typography>
          <Typography textStyle="body-md-regular" color="secondary">
            {row.summary}
          </Typography>
          <Typography
            textStyle="helper-sm-medium"
            color="brand"
            className="break-all"
          >
            {row.path}
          </Typography>
        </div>
      </Card>
    </Link>
  );
}

export default function States() {
  return (
    <div className="min-h-svh bg-surface-page-secondary">
      <main className="mx-auto min-h-svh w-full max-w-480 bg-surface-page-primary pb-64">
        <header className="flex flex-col gap-8 px-16 pt-[max(24px,env(safe-area-inset-top))]">
          <Link to="/chat" className="inline-flex min-h-44 items-center">
            <Typography textStyle="label-md-medium" color="brand">
              Back to home
            </Typography>
          </Link>
          <Typography textStyle="heading-xl" as="h1">
            All screens
          </Typography>
          <Typography textStyle="body-md-regular" color="secondary">
            Every screen of the car purchase has its own address. This page is
            for reviewers.
          </Typography>
        </header>

        <Section title="Buy a car">
          {ROWS.map((row, i) => (
            <Item key={row.path} row={row} n={i + 1} />
          ))}
        </Section>

        <Section title="Variations">
          {EXTRA.map((row) => (
            <Item key={row.path} row={row} />
          ))}
        </Section>

        <Section title="Other">
          <Item
            row={{
              path: "/story",
              title: "Story",
              summary:
                "The opening animation, then four full-screen stories, with Learn more.",
            }}
          />
          <Item
            row={{
              path: "/chat-2",
              title: "Chat 2",
              summary: "The chat without the 2x2 browse grid.",
            }}
          />
          <Item
            row={{
              path: "/chat",
              title: "Chat",
              summary:
                "Welcome, quick actions with the ongoing link, then every service. Menu button re-posts them.",
            }}
          />
          <Item
            row={{
              path: "/home",
              title: "Home tab",
              summary: "Booking in progress, glove box, and what we do.",
            }}
          />
          <Item
            row={{
              path: "/style-guide",
              title: "Style guide",
              summary: "The temporary sage style guide.",
            }}
          />
        </Section>
      </main>
    </div>
  );
}
