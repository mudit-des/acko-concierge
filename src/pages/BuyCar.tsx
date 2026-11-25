import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Badge } from "@acko/badge";
import { Button } from "@acko/button";
import { Card } from "@acko/card";
import { Tick } from "@acko/icons";
import { Typography } from "@acko/typography";
import { AlertIcon } from "../components/AlertIcon";
import { Bubble } from "../components/Bubble";
import { ChatHeader } from "../components/ChatHeader";
import { SearchingCard } from "../components/SearchingCard";
import { StepsTimeline } from "../components/StepsTimeline";
import { VerifyCard } from "../components/VerifyCard";
import {
  BOOKING_AMOUNT,
  CAR,
  CAR_CARD,
  DEALER_CLOSING,
  DEALER_SEARCH_LINES,
  DELIVERY_DATE,
  HEADS_UP_BODY,
  HEADS_UP_TITLE,
  PAPERWORK_DEADLINE,
  START_PATH,
  STEPS,
  VERIFIED_LINE,
  VERIFY_LINES,
  type GateOption,
} from "../data/booking";
import { navigate } from "../router";

const LAST = STEPS.length - 1;
const delay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/**
 * One page per state of the car purchase, chosen by the URL (see STEPS in data/booking.ts).
 * Every page shows the conversation so far plus its own update, so each URL is a snapshot.
 * The finance page also reads ?choice=us|bank to show the customer's reply.
 */
export default function BuyCar({ step, search }: { step: number; search: string }) {
  const reduce = useRef(window.matchMedia("(prefers-reduced-motion: reduce)").matches).current;
  const current = STEPS[step];
  const rawChoice = new URLSearchParams(search).get("choice");
  const choiceParam = rawChoice === "us" || rawChoice === "bank" ? rawChoice : null;

  const [verifyDone, setVerifyDone] = useState(step !== 1);
  const [talking, setTalking] = useState(false);
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);

  const verifying = step === 1 && !verifyDone;
  const mood = verifying ? "thinking" : current.mood;
  const delivered = step === LAST;
  const hasGate = Boolean(current.gate);
  const gated = hasGate && !choiceParam;
  // While documents are being checked the current stage is still paperwork.
  const stageNow = step === 1 && !verifyDone ? 0 : current.stage;
  const nextStep = STEPS[step + 1];
  const nextHref = nextStep ? nextStep.path + (choiceParam ? `?choice=${choiceParam}` : "") : START_PATH;

  const status = verifying ? "Verifying your documents" : hasGate && choiceParam ? "Finance choice saved" : current.status;
  const busy = verifying || (hasGate && choiceParam ? false : current.statusBusy);

  // The mascot speaks for a moment when a page opens.
  useEffect(() => {
    if (step === 0) return;
    setTalking(true);
    const t = window.setTimeout(() => setTalking(false), 1500);
    return () => window.clearTimeout(t);
  }, [step]);

  // Bring this page's update into view; and the reply when a finance choice is made.
  useEffect(() => {
    if (step === 0) return;
    const t = window.setTimeout(() => groupRefs.current[step]?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }), 120);
    return () => window.clearTimeout(t);
  }, [step, choiceParam, reduce]);

  return (
    <div className="min-h-svh bg-surface-page-secondary">
      <main className="mx-auto min-h-svh w-full max-w-480 bg-surface-page-primary pb-[calc(190px+env(safe-area-inset-bottom))]">
        <ChatHeader
          mood={mood}
          talking={talking}
          car={step > 0 ? { name: CAR.name, image: CAR.image, status, busy, stage: stageNow, allDone: delivered } : undefined}
          onBack={() => (window.history.length > 1 ? window.history.back() : navigate(step > 0 ? STEPS[step - 1].path : "/home"))}
        />

        {/* Booked screen: the full car card, the deadline and what happens next */}
        {step === 0 && (
          <div className="flex flex-col gap-8 px-16 pt-24 pb-32">
            <div className="reveal-up w-full rounded-5xl border border-border-default-soft bg-surface-card-default p-12">
              <img
                src={CAR.image}
                alt={`${CAR.name}, ${CAR.model}`}
                width={CAR.imageRatio.width}
                height={CAR.imageRatio.height}
                className="aspect-3/2 w-full rounded-2xl object-cover"
              />
              <div className="flex flex-col gap-16 p-8 pt-16">
                <div className="flex items-center justify-between gap-12">
                  <div className="flex min-w-0 flex-col">
                    <Typography textStyle="label-lg-semibold">{CAR.name}</Typography>
                    <Typography textStyle="helper-sm-regular" color="secondary">
                      {CAR.model}
                    </Typography>
                  </div>
                  <Badge color="green" size="md" icon={<Tick />}>
                    Booked
                  </Badge>
                </div>
                <Typography textStyle="heading-lg" as="h1" className="text-balance">
                  Congratulations, your {CAR.name} is booked!
                </Typography>
                <Typography textStyle="body-md-regular" color="secondary">
                  We have received the payment of {inr(BOOKING_AMOUNT)}. Please wait while we assign a dealer to fulfil your car's make and model.
                </Typography>
                <div className="flex items-center justify-between gap-12 border-t border-border-default-soft pt-16">
                  <Typography textStyle="body-md-regular" color="secondary">
                    Expected delivery
                  </Typography>
                  <span className="inline-flex items-center gap-8">
                    <span className="size-8 rounded-full bg-surface-status-warning" aria-hidden="true" />
                    <Typography textStyle="body-md-medium">Arrives {DELIVERY_DATE}</Typography>
                  </span>
                </div>
              </div>
            </div>

            <div className="reveal-up flex w-full items-start gap-8 rounded-3xl rounded-bl-md border border-border-default-soft bg-surface-card-default px-16 py-12" style={delay(200)}>
              <span className="mt-2">
                <AlertIcon />
              </span>
              <Typography textStyle="body-md-regular" color="secondary">
                Finish your paperwork by {PAPERWORK_DEADLINE} to keep your booking active.
              </Typography>
            </div>

            <section className="reveal-up flex w-full flex-col gap-24 rounded-5xl border border-border-default-soft bg-surface-card-default p-16" style={delay(320)} aria-labelledby="steps-title">
              <div className="flex flex-col gap-4">
                <Typography textStyle="label-md-semibold" color="brand">
                  Next steps
                </Typography>
                <Typography textStyle="heading-md" as="h2" id="steps-title" className="text-balance">
                  Here's what happens after this
                </Typography>
              </div>
              <StepsTimeline stage={stageNow} />
            </section>
          </div>
        )}

        {/* Every later page: the conversation so far, ending with this page's update */}
        {step > 0 && (
          <section className="flex flex-col gap-24 px-16 pt-24" aria-label="Updates from your concierge">
            {STEPS.slice(1, step + 1).map((s, idx) => {
              const i = idx + 1;
              const isCurrent = i === step;
              // Earlier finance screens assume "us" when no choice was carried in the URL.
              const picked = s.gate ? (isCurrent ? choiceParam : (choiceParam ?? "us")) : null;
              const opt: GateOption | undefined = picked && s.gate ? (picked === "bank" ? s.gate.secondary : s.gate.primary) : undefined;
              return (
                <div
                  key={s.id}
                  ref={(el) => {
                    groupRefs.current[i] = el;
                  }}
                  className="flex scroll-mt-88 flex-col gap-8"
                >
                  <Typography textStyle="helper-sm-regular" color="secondary">
                    {s.time}
                  </Typography>
                  {s.customerSays && (
                    <Bubble from="customer" animate={isCurrent}>
                      {s.customerSays}
                    </Bubble>
                  )}
                  {s.messages.map((m) => (
                    <Bubble key={m} from="concierge" animate={isCurrent}>
                      {m}
                    </Bubble>
                  ))}
                  {s.card === "verify" && (
                    <VerifyCard lines={VERIFY_LINES} finalLine={VERIFIED_LINE} skipAnimation={!isCurrent} onDone={() => isCurrent && setVerifyDone(true)} />
                  )}
                  {s.card === "searching" && (
                    <>
                      <SearchingCard lines={DEALER_SEARCH_LINES} closing={DEALER_CLOSING} />
                      <div className="flex w-full items-start gap-8 rounded-3xl rounded-bl-md border border-border-default-soft bg-surface-card-default px-16 py-12">
                        <span className="mt-2">
                          <AlertIcon />
                        </span>
                        <div className="flex flex-col gap-4">
                          <Typography textStyle="body-md-semibold">{HEADS_UP_TITLE}</Typography>
                          <Typography textStyle="body-md-regular" color="secondary">
                            {HEADS_UP_BODY}
                          </Typography>
                        </div>
                      </div>
                    </>
                  )}
                  {s.card === "car" && (
                    <Card variant="secondary" className="grid grid-cols-2 gap-x-16 gap-y-12 p-16">
                      {CAR_CARD.map((row) => (
                        <div key={row.label} className="flex flex-col">
                          <Typography textStyle="helper-sm-regular" color="secondary">
                            {row.label}
                          </Typography>
                          <Typography textStyle="body-sm-medium">{row.value}</Typography>
                        </div>
                      ))}
                    </Card>
                  )}
                  {opt && (
                    <>
                      <Bubble from="customer" animate={isCurrent}>
                        {opt.said}
                      </Bubble>
                      {opt.reply?.map((m) => (
                        <Bubble key={m} from="concierge" animate={isCurrent}>
                          {m}
                        </Bubble>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </section>
        )}
      </main>

      {/* One sticky action: names the customer's next move */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 pt-32"
        style={{ zIndex: "var(--zSticky)", background: "linear-gradient(180deg, transparent 0%, var(--surfacePagePrimary) 40%)" }}
      >
        <div className="pointer-events-auto mx-auto flex w-full max-w-480 flex-col gap-8 px-16 pb-[max(16px,env(safe-area-inset-bottom))]">
          {gated && current.gate ? (
            <>
              <Button size="lg" fullWidth onClick={() => navigate(`${current.path}?choice=${current.gate!.primary.value}`)}>
                {current.gate.primary.label}
              </Button>
              {current.gate.secondary && (
                <Button size="md" fullWidth variant="secondary" onClick={() => navigate(`${current.path}?choice=${current.gate!.secondary!.value}`)}>
                  {current.gate.secondary.label}
                </Button>
              )}
            </>
          ) : verifying ? (
            <Typography textStyle="body-md-regular" color="secondary" align="center" aria-live="polite">
              I'm checking your documents. This takes a few seconds.
            </Typography>
          ) : current.action ? (
            <Button size="lg" fullWidth onClick={() => navigate(current.action!.to)}>
              {current.action.label}
            </Button>
          ) : delivered ? (
            <Button size="md" fullWidth variant="secondary" onClick={() => navigate(START_PATH)}>
              Back to the start (demo)
            </Button>
          ) : (
            <>
              <Typography textStyle="body-md-regular" color="secondary" align="center">
                Nothing needed from you. We'll message you here.
              </Typography>
              <Button size="md" fullWidth variant="secondary" onClick={() => navigate(nextHref)}>
                Show next update (demo)
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
