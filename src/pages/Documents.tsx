import { useEffect, useRef, useState } from "react";
import { Button } from "@acko/button";
import { Card } from "@acko/card";
import { Lock, Tick } from "@acko/icons";
import { Typography } from "@acko/typography";
import { Bubble } from "../components/Bubble";
import { ChatHeader } from "../components/ChatHeader";
import { HelpButton } from "../components/HelpButton";
import { Icon } from "../components/Icon";
import { CAR, DOCUMENT_ROWS, STEPS } from "../data/booking";
import { navigate } from "../router";

type RowState = { status: "empty" | "adding" | "added"; name?: string };
type Id = (typeof DOCUMENT_ROWS)[number]["id"];

/**
 * Paperwork step. Prototype: tapping Upload marks the document as added without choosing a file, so every
 * state can be shown. A real build would pick and upload to the verification service.
 */
export default function Documents() {
  const reduce = useRef(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  ).current;
  const [rows, setRows] = useState<Record<Id, RowState>>({
    aadhaar: { status: "empty" },
    pan: { status: "empty" },
  });
  const timers = useRef<number[]>([]);

  const addedCount = DOCUMENT_ROWS.filter(
    (r) => rows[r.id].status === "added",
  ).length;
  const ready = addedCount === DOCUMENT_ROWS.length;
  const adding = DOCUMENT_ROWS.some((r) => rows[r.id].status === "adding");

  useEffect(() => {
    const all = timers.current;
    return () => all.forEach(window.clearTimeout);
  }, []);

  // Prototype: tapping Upload stands in for choosing a file. Real file picking comes later.
  const pick = (id: Id, name: string) => {
    setRows((r) => ({ ...r, [id]: { status: "adding", name } }));
    timers.current.push(
      window.setTimeout(
        () =>
          setRows((r) => ({
            ...r,
            [id]: { status: "added", name },
          })),
        reduce ? 0 : 900,
      ),
    );
  };

  const submit = () => {
    navigate(STEPS[1].path);
  };

  return (
    <div className="min-h-svh bg-surface-page-secondary">
      <main className="mx-auto min-h-svh w-full max-w-480 bg-surface-page-primary pb-[calc(230px+env(safe-area-inset-bottom))]">
        <ChatHeader
          mood="asking"
          car={{
            name: CAR.name,
            image: CAR.image,
            status: adding
              ? "Receiving your document"
              : ready
                ? "Ready to check them"
                : "Waiting for your documents",
            busy: !ready,
            stage: 0,
            allDone: false,
          }}
          onBack={() =>
            window.history.length > 1
              ? window.history.back()
              : navigate(STEPS[0].path)
          }
        />

        {/* Otto asks for the KYC documents, with the two checks folded into what he says */}
        <div className="flex flex-col gap-4 px-16 pt-16">
          <Bubble from="concierge" animate>
            Let's get your KYC done. I need your Aadhaar and your PAN, and I'll
            take care of the rest.
          </Bubble>
          <Bubble from="concierge" animate>
            Make sure the name matches on both, and that your Aadhaar address
            shows Bengaluru, since that's where the car gets registered.
          </Bubble>
        </div>

        {/* Documents */}
        <section
          className="reveal-up flex flex-col gap-16 px-16 pt-16"
          style={{ animationDelay: "240ms" }}
          aria-label="Your documents"
        >
          <Card variant="primary" className="flex flex-col p-16">
            {DOCUMENT_ROWS.map((row, i) => {
              const state = rows[row.id];
              return (
                <div
                  key={row.id}
                  className={`flex items-center justify-between gap-16 ${i > 0 ? "mt-16 border-t border-border-default-soft pt-16" : ""}`}
                >
                  <div className="flex min-w-0 flex-col gap-4">
                    <Typography textStyle="body-md-semibold">
                      {row.title}
                    </Typography>
                    <Typography
                      textStyle="body-md-regular"
                      color="secondary"
                      truncate={state.status !== "empty"}
                    >
                      {state.status === "empty" ? row.hint : state.name}
                    </Typography>
                  </div>
                  {state.status === "adding" ? (
                    <span className="grid size-48 place-items-center">
                      <span
                        className="spinner"
                        role="status"
                        aria-label="Adding"
                      />
                    </span>
                  ) : state.status === "added" ? (
                    <span className="flex shrink-0 items-center gap-8">
                      <span
                        className="grid size-24 place-items-center rounded-full bg-brand-selection-default text-text-static-light"
                        aria-label="Added"
                      >
                        <Icon icon={Tick} size={16} />
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => pick(row.id, `${row.title}.jpg`)}
                      >
                        Replace
                      </Button>
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => pick(row.id, `${row.title}.jpg`)}
                    >
                      Upload
                    </Button>
                  )}
                </div>
              );
            })}
            <div className="mt-16 flex items-start gap-8 border-t border-border-default-soft pt-16">
              <span className="mt-2 shrink-0 text-text-secondary">
                <Icon icon={Lock} size={16} />
              </span>
              <Typography textStyle="helper-sm-regular" color="secondary">
                Encrypted, and used only for this purchase. Nobody else sees
                them.
              </Typography>
            </div>
          </Card>
        </section>
      </main>

      {/* Sticky action */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 pt-32"
        style={{
          zIndex: "var(--zSticky)",
          background:
            "linear-gradient(180deg, transparent 0%, var(--surfacePagePrimary) 40%)",
        }}
      >
        <div className="pointer-events-auto mx-auto flex w-full max-w-480 items-end gap-8 px-16 pb-[max(16px,env(safe-area-inset-bottom))]">
          <HelpButton />
          <div className="flex min-w-0 flex-1 flex-col gap-8">
            <Button size="md" fullWidth disabled={!ready} onClick={submit}>
              Submit my KYC
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
