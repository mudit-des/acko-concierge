import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Badge } from "@acko/badge";
import { Button } from "@acko/button";
import { ArrowDown, ChevronDown, ChevronUp, Tick } from "@acko/icons";
import { Typography } from "@acko/typography";
import { Bubble } from "../components/Bubble";
import { CarDetails } from "../components/CarDetails";
import { ChatHeader } from "../components/ChatHeader";
import { HelpButton } from "../components/HelpButton";
import { PayOptionCard } from "../components/PayOptionCard";
import { StepsTimeline } from "../components/StepsTimeline";
import { VerifyCard } from "../components/VerifyCard";
import {
  BOOKING_AMOUNT,
  inr,
  CAR,
  DELIVERY_DATE,
  PAPERWORK_DEADLINE,
  START_PATH,
  stageTarget,
  STEPS,
  VERIFIED_LINE,
  VERIFY_LINES,
  type PayOption,
  type PayValue,
} from "../data/booking";
import { navigate } from "../router";

const LAST = STEPS.length - 1;
const delay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

/**
 * One page per state of the car purchase, chosen by the URL (see STEPS in data/booking.ts).
 * Every page shows the conversation so far plus its own update, so each URL is a snapshot.
 * The finance page also reads ?choice=us|bank to show the customer's reply.
 */
export default function BuyCar({
  step,
  search,
}: {
  step: number;
  search: string;
}) {
  const reduce = useRef(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  ).current;
  const current = STEPS[step];
  const rawChoice = new URLSearchParams(search).get("choice");
  const choiceParam =
    rawChoice === "us" || rawChoice === "bank" || rawChoice === "full"
      ? (rawChoice as PayValue)
      : null;

  const [verifyDone, setVerifyDone] = useState(step !== 1);
  const [talking, setTalking] = useState(false);
  const [stepsOpen, setStepsOpen] = useState(false);
  const [pay, setPay] = useState<PayValue | null>(null);
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [awayFromLatest, setAwayFromLatest] = useState(false);

  // Show "Back to latest" once the reader has scrolled well above the newest update.
  useEffect(() => {
    if (step === 0) return;
    const onScroll = () => {
      const el = groupRefs.current[step];
      setAwayFromLatest(
        Boolean(el) && el!.getBoundingClientRect().top > window.innerHeight,
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [step]);

  const flash = (el: HTMLElement | null | undefined) => {
    if (!el) return;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    el.classList.remove("flash");
    void el.offsetWidth;
    el.classList.add("flash");
    window.setTimeout(() => el.classList.remove("flash"), 1400);
  };

  // A tapped step in the timeline jumps to the first update of that stage that exists on this page.
  const goToStage = (stage: number) => {
    flash(groupRefs.current[Math.min(stageTarget(stage), step)]);
  };

  const verifying = step === 1 && !verifyDone;
  const mood = verifying ? "thinking" : current.mood;
  const delivered = step === LAST;
  const hasGate = Boolean(current.gate);
  const gated = hasGate && !choiceParam;
  const selectedPay = current.gate ? (pay ?? current.gate.preselected) : null;
  const selectedOption = current.gate?.options.find(
    (o) => o.value === selectedPay,
  );
  // While documents are being checked the current stage is still paperwork.
  const stageNow = step === 1 && !verifyDone ? 0 : current.stage;
  const nextStep = STEPS[step + 1];
  const nextHref = nextStep
    ? nextStep.path + (choiceParam ? `?choice=${choiceParam}` : "")
    : START_PATH;

  const status = verifying
    ? "Verifying your documents"
    : hasGate && choiceParam
      ? "Finance choice saved"
      : current.status;
  const busy =
    verifying || (hasGate && choiceParam ? false : current.statusBusy);

  // Once the documents check out, Otto carries straight on to the dealer search: no "What's next?" tap.
  useEffect(() => {
    if (step !== 1 || !verifyDone) return;
    const t = window.setTimeout(
      () => navigate(STEPS[2].path, { replace: true }),
      reduce ? 600 : 1400,
    );
    return () => window.clearTimeout(t);
  }, [step, verifyDone, reduce]);

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
    const t = window.setTimeout(
      () =>
        groupRefs.current[step]?.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "center",
        }),
      120,
    );
    return () => window.clearTimeout(t);
  }, [step, choiceParam, reduce]);

  return (
    <div className="min-h-svh bg-surface-page-secondary">
      <main className="mx-auto min-h-svh w-full max-w-480 bg-surface-page-primary pb-[calc(190px+env(safe-area-inset-bottom))]">
        <ChatHeader
          mood={mood}
          talking={talking}
          car={
            step > 0
              ? {
                  name: CAR.name,
                  image: CAR.image,
                  status,
                  busy,
                  stage: stageNow,
                  allDone: delivered,
                }
              : undefined
          }
          onSelectStage={step > 0 ? goToStage : undefined}
          onBack={() =>
            window.history.length > 1
              ? window.history.back()
              : navigate(step > 0 ? STEPS[step - 1].path : "/chat")
          }
        />

        {/* Booked screen: Otto says it once, then one compact car card. The next steps open from inside it. */}
        {step === 0 && (
          <div className="flex flex-col gap-16 px-16 pt-16 pb-32">
            <div className="flex flex-col gap-4">
              <Bubble from="concierge" animate>
                Congratulations, your {CAR.name} {CAR.model} is booked! I've
                received your {inr(BOOKING_AMOUNT)}.
              </Bubble>
              <Bubble from="concierge" animate>
                Next I need you to do your KYC by {PAPERWORK_DEADLINE}. Keep
                your PAN and Aadhaar handy and finish it here.
              </Bubble>
            </div>

            <div
              className="reveal-up w-full rounded-5xl border border-border-default-soft bg-surface-card-default p-12"
              style={delay(200)}
            >
              <img
                src={CAR.image}
                alt={`${CAR.name}, ${CAR.model}`}
                width={CAR.imageRatio.width}
                height={CAR.imageRatio.height}
                className="aspect-[2/1] w-full rounded-2xl object-cover"
                style={{ objectPosition: "50% 58%" }}
              />
              <div className="flex items-center justify-between gap-12 px-4 pt-12 pb-4">
                <div className="flex min-w-0 flex-col">
                  <Typography textStyle="label-lg-semibold">
                    {CAR.name}
                  </Typography>
                  <Typography textStyle="helper-sm-regular" color="secondary">
                    {CAR.model} · Arrives {DELIVERY_DATE}
                  </Typography>
                </div>
                <Badge color="green" size="md" icon={<Tick />}>
                  Booked
                </Badge>
              </div>
              <button
                type="button"
                onClick={() => setStepsOpen((o) => !o)}
                aria-expanded={stepsOpen}
                aria-controls="booked-steps"
                className="mt-12 flex min-h-44 w-full items-center justify-between gap-8 border-t border-border-default-soft px-4 pt-4 text-left"
              >
                <Typography textStyle="label-md-semibold" color="brand">
                  {stepsOpen ? "Hide the next steps" : "See the next steps"}
                </Typography>
                <span
                  className="text-text-secondary [&_svg]:size-20"
                  aria-hidden="true"
                >
                  {stepsOpen ? <ChevronUp /> : <ChevronDown />}
                </span>
              </button>
              {stepsOpen && (
                <div id="booked-steps" className="reveal-up px-4 pt-12 pb-8">
                  <StepsTimeline stage={stageNow} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Every later page: the conversation so far, ending with this page's update */}
        {step > 0 && (
          <section
            className="flex flex-col gap-24 px-16 pt-24"
            aria-label="Updates from Otto"
          >
            {STEPS.slice(1, step + 1).map((s, idx) => {
              const i = idx + 1;
              const isCurrent = i === step;
              // Earlier finance screens assume "us" when no choice was carried in the URL.
              const picked = s.gate
                ? isCurrent
                  ? choiceParam
                  : (choiceParam ?? "us")
                : null;
              const opt: PayOption | undefined =
                picked && s.gate
                  ? s.gate.options.find((o) => o.value === picked)
                  : undefined;
              return (
                <div
                  key={s.id}
                  ref={(el) => {
                    groupRefs.current[i] = el;
                  }}
                  className="flex scroll-mt-200 flex-col gap-8"
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
                  {isCurrent && gated && s.gate && (
                    <div
                      role="radiogroup"
                      aria-label="How to pay"
                      className="flex flex-col gap-8"
                    >
                      {s.gate.options.map((o) => (
                        <PayOptionCard
                          key={o.value}
                          option={o}
                          selected={selectedPay === o.value}
                          onSelect={() => setPay(o.value)}
                        />
                      ))}
                    </div>
                  )}
                  {s.card === "verify" && (
                    <VerifyCard
                      lines={VERIFY_LINES}
                      finalLine={VERIFIED_LINE}
                      skipAnimation={!isCurrent}
                      onDone={() => isCurrent && setVerifyDone(true)}
                    />
                  )}
                  {s.card === "assigned" && <CarDetails />}
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
        style={{
          zIndex: "var(--zSticky)",
          background:
            "linear-gradient(180deg, transparent 0%, var(--surfacePagePrimary) 40%)",
        }}
      >
        <div className="pointer-events-auto mx-auto flex w-full max-w-480 items-end gap-8 px-16 pb-[max(16px,env(safe-area-inset-bottom))]">
          <HelpButton />
          <div className="flex min-w-0 flex-1 flex-col gap-8">
            {awayFromLatest && (
              <div className="flex justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  iconLeft={<ArrowDown aria-hidden="true" />}
                  onClick={() => flash(groupRefs.current[step])}
                >
                  Back to latest
                </Button>
              </div>
            )}
            {gated && selectedOption ? (
              <Button
                size="md"
                fullWidth
                onClick={() =>
                  navigate(`${current.path}?choice=${selectedOption.value}`)
                }
              >
                {selectedOption.confirm}
              </Button>
            ) : verifying ? (
              <Typography
                textStyle="body-md-regular"
                color="secondary"
                align="center"
                aria-live="polite"
              >
                I'm checking your documents. This takes a few seconds.
              </Typography>
            ) : step === 1 ? null : current.action ? (
              <Button
                size="md"
                fullWidth
                onClick={() => navigate(current.action!.to)}
              >
                {current.action.label}
              </Button>
            ) : delivered ? (
              <Button
                size="md"
                fullWidth
                variant="secondary"
                onClick={() => navigate(START_PATH)}
              >
                Back to the start (demo)
              </Button>
            ) : (
              <>
                <Typography
                  textStyle="body-md-regular"
                  color="secondary"
                  align="center"
                >
                  Nothing needed from you. We'll message you here.
                </Typography>
                <Button
                  size="md"
                  fullWidth
                  variant="secondary"
                  onClick={() => navigate(nextHref)}
                >
                  Show next update (demo)
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
