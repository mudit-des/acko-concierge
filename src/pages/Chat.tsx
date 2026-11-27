import { useMemo, useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  CarAccident,
  CarService,
  Coverage,
  Menu02,
  PolicyDocument,
  PriceTag,
} from "@acko/icons";
import { Typography } from "@acko/typography";
import { asset } from "../asset";
import { Bubble, TypingBubble } from "../components/Bubble";
import { Icon, type IconType } from "../components/Icon";
import { OttoHeader } from "../components/OttoHeader";
import { MenuSheet } from "../components/MenuSheet";
import { Composer } from "../components/Composer";
import { ServiceGrid } from "../components/ServiceGrid";
import {
  ASK_TEXT,
  INTENTS,
  QUICK_ACTIONS,
  SERVICES,
  VIEW_ALL_ACTION,
  matchIntent,
  type Chip,
  type IntentId,
} from "../data/chat";
import {
  GRID_ITEMS,
  arrangeGrid,
  getStage,
  greetingFor,
  type CustomerStage,
} from "../data/context";
import { ACTIVE_BOOKING } from "../data/home";
import { CAR } from "../data/booking";
import { navigate, useLocation } from "../router";

/*
 * The whole app after the stories: one chat. The concierge welcomes you, offers quick actions (with a
 * link to what is ongoing), then lists everything it can do. Every row sends a message and the scripted
 * conversation continues (see data/chat.ts). The menu button beside the input brings the menu back.
 * The thread lives at module level, so leaving for the tracker and coming back keeps it.
 */

type Kind = "text" | "quick" | "services" | "grid";
interface Msg {
  id: number;
  from: "bot" | "user";
  kind: Kind;
  text?: string;
  chips?: Chip[];
}

let nextId = 1;
const INTRO: Omit<Msg, "id">[] = [
  {
    from: "bot",
    kind: "text",
    text: "Hi, I'm Otto, your car companion. I'm here to help you out. What do you need right now?",
  },
  { from: "bot", kind: "quick" },
];
/** What a first-time visitor sees: Otto's greeting (it varies with the customer's stage), then every action as a grid. */
const introFor = (stage: CustomerStage | null): Omit<Msg, "id">[] => [
  { from: "bot", kind: "text", text: greetingFor(stage) },
  { from: "bot", kind: "grid" },
];
/** One thread per address, so the first-time and returning screens never mix. */
const STORES: Record<string, { thread: Msg[]; introStep: number }> = {};
const reduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clearChips = (m: Msg[]) =>
  m.map((x) => (x.chips ? { ...x, chips: undefined } : x));
/** Pills take the sage brand: soft sage by default, red for an emergency, solid sage for the one that leads to everything. */
const sageStyle = {
  backgroundColor: "var(--brandPrimary100)",
  borderColor: "var(--brandPrimary200)",
  color: "var(--brandPrimary850)",
};
const urgentStyle = {
  backgroundColor: "color-mix(in srgb, var(--textStatusError) 8%, white)",
  borderColor: "var(--borderStatusError)",
  color: "var(--textStatusError)",
};
const solidStyle = {
  backgroundColor: "var(--brandPrimary600)",
  borderColor: "var(--brandPrimary600)",
  color: "var(--brandPrimaryWhite)",
};
const BENTO = [
  {
    title: "Buy a car",
    body: "Advice, a fair price, and we chase the rest.",
    intent: "buy" as IntentId,
    image: asset("/illustrations/tile-buy.webp"),
  },
  {
    title: "Sell your car",
    body: "A fair price and a verified buyer.",
    intent: "sell" as IntentId,
    image: asset("/illustrations/tile-sell.webp"),
  },
  {
    title: "Exchange your car",
    body: "Trade in your old car for a new one.",
    intent: "exchange" as IntentId,
    image: asset("/illustrations/tile-exchange.webp"),
  },
  {
    title: "Insure your car",
    body: "Buy, renew or claim in one place.",
    intent: "insurance" as IntentId,
    image: asset("/illustrations/tile-insure.webp"),
  },
];
const PILL_ICON: Partial<Record<IntentId, IconType>> = {
  emergency: Alert,
  cars: PriceTag,
  service: CarService,
  claim: CarAccident,
  insurance: Coverage,
  glovebox: PolicyDocument,
  allservices: Menu02,
};
/** The 3D icon for a pill, where one exists; otherwise the plain icon is used. */
const pillImage = (intent: IntentId) =>
  GRID_ITEMS.find((g) => g.intent === intent)?.image;
const pillStyle = (a: { urgent?: boolean; intent?: string }) =>
  a.urgent ? urgentStyle : a.intent === "allservices" ? solidStyle : sageStyle;

/** `browse` shows the 2x2 "Or browse what we do" grid (/chat-1). The default has no grid but a "View all services" pill. */
export default function Chat({
  browse = false,
  first = false,
  path = "/chat",
}: {
  browse?: boolean;
  first?: boolean;
  path?: string;
}) {
  const { search } = useLocation();
  const stage = getStage(search);
  const store = useMemo(
    () => (STORES[`${path}|${stage ?? ""}`] ??= { thread: [], introStep: 0 }),
    [path, stage],
  );
  const intro = useMemo(
    () => (first ? introFor(stage) : INTRO),
    [first, stage],
  );
  const [messages, setMessages] = useState<Msg[]>(store.thread);
  const [typing, setTyping] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    store.thread = messages;
  }, [messages, store]);
  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: reduceMotion() ? "auto" : "smooth",
      block: "end",
    });
  }, [messages, typing]);

  const post = useCallback((msgs: Omit<Msg, "id">[], onEach?: () => void) => {
    const timers: number[] = [];
    const quick = reduceMotion();
    let t = 0;
    msgs.forEach((m) => {
      const gap = m.kind === "text" ? 900 : 350;
      t += quick ? 0 : gap;
      timers.push(
        window.setTimeout(() => setTyping(true), quick ? 0 : t - gap),
      );
      timers.push(
        window.setTimeout(() => {
          setTyping(false);
          setMessages((cur) => [...clearChips(cur), { ...m, id: nextId++ }]);
          onEach?.();
        }, t),
      );
    });
    return () => {
      timers.forEach((x) => window.clearTimeout(x));
      setTyping(false);
    };
  }, []);

  // The welcome plays once; leaving mid-way resumes where it stopped.
  useEffect(() => {
    if (store.introStep >= intro.length) return;
    return post(intro.slice(store.introStep), () => {
      store.introStep++;
    });
  }, [post, store, intro]);

  const reply = useCallback(
    (intent: IntentId) => {
      const answer: Omit<Msg, "id"> = {
        from: "bot",
        kind: "text",
        text: INTENTS[intent].answer,
        chips: INTENTS[intent].chips,
      };
      post(
        intent === "allservices"
          ? [answer, { from: "bot", kind: "services" }]
          : [answer],
      );
    },
    [post],
  );

  const say = useCallback(
    (text: string, intent: IntentId) => {
      setMessages((m) => [
        ...clearChips(m),
        { id: nextId++, from: "user", kind: "text", text },
      ]);
      reply(intent);
    },
    [reply],
  );

  const [menuOpen, setMenuOpen] = useState(false);

  // ?ask=<intent> starts that conversation once.
  const started = useRef("");
  useEffect(() => {
    const ask = new URLSearchParams(search).get("ask") as IntentId | null;
    if (!ask || !(ask in INTENTS) || started.current === ask) return;
    started.current = ask;
    say(ASK_TEXT[ask], ask);
    navigate(path, { replace: true });
  }, [search, say, path]);

  const pick = (chip: Chip) => {
    if (chip.to) return navigate(chip.to);
    say(chip.label, chip.intent ?? "fallback");
  };

  const pill =
    "inline-flex min-h-32 items-center gap-6 rounded-full border pr-14 pl-12 text-left transition-transform active:scale-[0.97]";

  const renderBody = (m: Msg) => {
    if (m.kind === "grid") {
      return (
        <div className="flex flex-col gap-20 pt-12">
          <ServiceGrid
            items={arrangeGrid(stage)}
            picked={picked}
            onPick={(i) => {
              setPicked(i.id);
              say(ASK_TEXT[i.intent], i.intent);
            }}
          />
        </div>
      );
    }
    if (m.kind === "quick")
      return (
        <div className="flex flex-col gap-8 pt-8">
          <div className="flex flex-wrap gap-8">
            {(browse ? QUICK_ACTIONS : [...QUICK_ACTIONS, VIEW_ALL_ACTION]).map(
              (a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => say(ASK_TEXT[a.intent], a.intent)}
                  className={pill}
                  style={pillStyle(a)}
                >
                  {pillImage(a.intent) ? (
                    <img
                      src={pillImage(a.intent)}
                      alt=""
                      className="pointer-events-none size-[22px] object-contain"
                    />
                  ) : (
                    PILL_ICON[a.intent] && (
                      <Icon icon={PILL_ICON[a.intent]!} size={16} />
                    )
                  )}
                  <Typography
                    textStyle="label-md-medium"
                    as="span"
                    style={{ color: "inherit" }}
                  >
                    {a.label}
                  </Typography>
                </button>
              ),
            )}
          </div>
          <section
            aria-labelledby="ongoing-title"
            className="flex flex-col gap-16 pt-8"
          >
            <div className="flex items-center gap-12" id="ongoing-title">
              <span
                className="h-px flex-1 bg-border-default-soft"
                aria-hidden="true"
              />
              <Typography
                textStyle="label-md-semibold"
                color="secondary"
                as="h2"
              >
                Ongoing
              </Typography>
              <span
                className="h-px flex-1 bg-border-default-soft"
                aria-hidden="true"
              />
            </div>
            <button
              type="button"
              onClick={() => navigate(ACTIVE_BOOKING.path)}
              className="flex min-h-96 items-center gap-12 overflow-hidden rounded-2xl border border-border-default-soft bg-surface-card-default p-8 pr-16 text-left active:scale-[0.98]"
            >
              <img
                src={asset("/illustrations/car-creta.webp")}
                alt=""
                width={120}
                height={80}
                className="h-80 w-120 shrink-0 rounded-xl bg-surface-page-secondary object-cover"
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <Typography textStyle="label-md-semibold" as="span">
                  {CAR.name}
                </Typography>
                <Typography
                  textStyle="body-md-regular"
                  color="secondary"
                  as="span"
                >
                  {ACTIVE_BOOKING.status}
                </Typography>
              </span>
              <Typography
                textStyle="body-lg-regular"
                color="secondary"
                as="span"
                aria-hidden="true"
              >
                ›
              </Typography>
            </button>
          </section>
          {browse && (
            <section
              aria-labelledby="browse-title"
              className="flex flex-col gap-16 pt-8"
            >
              <div className="flex items-center gap-12" id="browse-title">
                <span
                  className="h-px flex-1 bg-border-default-soft"
                  aria-hidden="true"
                />
                <Typography
                  textStyle="label-md-semibold"
                  color="secondary"
                  as="h2"
                >
                  Or browse what we do
                </Typography>
                <span
                  className="h-px flex-1 bg-border-default-soft"
                  aria-hidden="true"
                />
              </div>
              <div className="grid grid-cols-2 items-stretch gap-8">
                {BENTO.map((r, i) => (
                  <button
                    key={r.title}
                    type="button"
                    onClick={() => say(ASK_TEXT[r.intent], r.intent)}
                    className={`flex flex-col gap-12 overflow-hidden rounded-5xl border border-border-default-soft bg-surface-card-default p-8 text-left shadow-s transition-transform active:scale-[0.98] `}
                  >
                    <span
                      className={`relative block overflow-hidden rounded-2xl bg-surface-page-secondary aspect-[4/3]`}
                    >
                      <img
                        src={r.image}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 size-full object-cover"
                        style={{
                          objectPosition: i === 0 ? "36% 50%" : "50% 40%",
                        }}
                      />
                    </span>
                    <span className="flex flex-col gap-2 px-4 pb-4">
                      <Typography textStyle="label-lg-medium" as="h3">
                        {r.title}
                      </Typography>
                      <Typography textStyle="body-md-regular" color="secondary">
                        {r.body}
                      </Typography>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      );
    if (m.kind === "services")
      return (
        <div className="flex flex-col rounded-3xl border border-border-default-soft bg-surface-card-default p-8">
          {SERVICES.map((r) => (
            <button
              key={r.title}
              type="button"
              onClick={() => say(ASK_TEXT[r.intent], r.intent)}
              className="flex min-h-64 items-center gap-12 rounded-2xl p-8 text-left active:bg-surface-page-secondary"
            >
              <span className="grid size-[52px] shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--brandPrimary100)] text-text-primary">
                {r.image ? (
                  <img
                    src={r.image}
                    alt=""
                    loading="lazy"
                    className="size-[38px] object-contain"
                  />
                ) : (
                  r.icon && <Icon icon={r.icon} size={24} />
                )}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <Typography textStyle="label-lg-medium" as="span">
                  {r.title}
                </Typography>
                <Typography
                  textStyle="body-md-regular"
                  color="secondary"
                  as="span"
                >
                  {r.note}
                </Typography>
              </span>
              <Typography
                textStyle="body-lg-regular"
                color="secondary"
                as="span"
                aria-hidden="true"
              >
                ›
              </Typography>
            </button>
          ))}
        </div>
      );
    return (
      <>
        <Bubble from={m.from === "user" ? "customer" : "concierge"}>
          {m.text}
        </Bubble>
        {m.chips && (
          <div className="flex flex-wrap gap-8">
            {m.chips.map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => pick(c)}
                className={pill}
                style={pillStyle(c)}
              >
                <Typography
                  textStyle="label-md-medium"
                  as="span"
                  style={{ color: "inherit" }}
                >
                  {c.label}
                </Typography>
              </button>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-svh bg-surface-page-secondary">
      <main className="relative mx-auto flex h-svh overflow-hidden w-full max-w-480 flex-col bg-surface-page-primary">
        <header className="border-b border-border-default-soft px-16 pt-[max(8px,env(safe-area-inset-top))] pb-8">
          <OttoHeader mood={typing ? "thinking" : "happy"} talking={typing} />
        </header>

        <div
          className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-16 py-8"
          aria-live="polite"
        >
          {messages.map((m, i) => {
            // Two Otto messages in a row read as one thought: close the gap between them.
            const prev = messages[i - 1];
            const joined =
              prev &&
              prev.from === "bot" &&
              prev.kind === "text" &&
              m.from === "bot" &&
              m.kind === "text";
            return (
              <div
                key={m.id}
                className={`flex flex-col gap-8 ${joined ? "-mt-6" : ""}`}
              >
                {renderBody(m)}
              </div>
            );
          })}
          {typing && <TypingBubble />}
          <div ref={endRef} />
        </div>

        <Composer
          onSend={(text) => say(text, matchIntent(text))}
          onMenu={() => setMenuOpen(true)}
        />
        <MenuSheet
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onAsk={(i) => say(ASK_TEXT[i], i)}
        />
      </main>
    </div>
  );
}
