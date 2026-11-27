import {
  useMemo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  Alert,
  ArrowUp,
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
import { RollingHint } from "../components/RollingHint";
import {
  ASK_TEXT,
  EMERGENCY_ICON,
  INTENTS,
  QUICK_ACTIONS,
  SERVICES,
  VIEW_ALL_ACTION,
  matchIntent,
  type Chip,
  type IntentId,
} from "../data/chat";
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
/** What a first-time visitor sees: Otto introduces itself, then every action as a grid. */
const INTRO_FIRST: Omit<Msg, "id">[] = [
  {
    from: "bot",
    kind: "text",
    text: "Hey, I'm Otto, your car companion. I take care of the annoying car stuff, so you don't have to.",
  },
  {
    from: "bot",
    kind: "text",
    text: "Here's how I can help you, or just ask away in chat.",
  },
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
    title: "Sell",
    body: "A fair price and a verified buyer.",
    intent: "sell" as IntentId,
    image: asset("/illustrations/tile-sell.webp"),
  },
  {
    title: "Exchange",
    body: "Trade in your old car for a new one.",
    intent: "exchange" as IntentId,
    image: asset("/illustrations/tile-exchange.webp"),
  },
  {
    title: "Car insurance",
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
  const store = useMemo(
    () => (STORES[path] ??= { thread: [], introStep: 0 }),
    [path],
  );
  const intro = first ? INTRO_FIRST : INTRO;
  const [messages, setMessages] = useState<Msg[]>(store.thread);
  const [typing, setTyping] = useState(false);
  const [picked, setPicked] = useState<IntentId | null>(null);
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);
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
  const send = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    say(text, matchIntent(text));
  };

  const showHint = !draft && !focused;
  const pill =
    "inline-flex min-h-32 items-center gap-6 rounded-full border pr-14 pl-12 text-left transition-transform active:scale-[0.97]";

  const renderBody = (m: Msg) => {
    if (m.kind === "grid") {
      const items = [
        {
          title: "Emergency",
          intent: "emergency" as IntentId,
          image: EMERGENCY_ICON,
          urgent: true,
        },
        ...SERVICES.map((r) => ({
          title: r.title,
          intent: r.intent,
          image: r.image,
          urgent: false,
        })),
      ];
      return (
        <div className="flex flex-col gap-20 pt-12">
          {/* Icons on pale sage plates, no cards. Emergency gets a soft pink plate and a red label. */}
          <div className="grid grid-cols-3 gap-x-8 gap-y-20">
            {items.map((i) => {
              const selected = picked === i.intent;
              return (
                <button
                  key={i.title}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setPicked(i.intent);
                    say(ASK_TEXT[i.intent], i.intent);
                  }}
                  className="group flex flex-col items-center gap-10 rounded-3xl text-center outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-selection-default"
                >
                  <span
                    className={`grid size-[84px] place-items-center rounded-full transition-[transform,background-color,box-shadow] duration-200 group-active:scale-95 motion-reduce:transition-none ${
                      i.urgent
                        ? "[@media(hover:hover)]:group-hover:bg-[color-mix(in_srgb,var(--textStatusError)_16%,white)]"
                        : "[@media(hover:hover)]:group-hover:bg-[var(--brandPrimary150)]"
                    }`}
                    style={{
                      backgroundColor: i.urgent
                        ? "color-mix(in srgb, var(--textStatusError) 10%, white)"
                        : "var(--brandPrimary100)",
                      boxShadow: selected
                        ? `0 0 0 3px var(--surfacePagePrimary), 0 0 0 5px ${i.urgent ? "var(--textStatusError)" : "var(--brandPrimary600)"}`
                        : "none",
                    }}
                  >
                    <img
                      src={i.image}
                      alt=""
                      loading="lazy"
                      className="pointer-events-none size-[60px] object-contain transition-transform duration-200 [@media(hover:hover)]:group-hover:scale-105 motion-reduce:transition-none"
                    />
                  </span>
                  <Typography
                    textStyle="label-md-semibold"
                    as="span"
                    className="min-h-[36px] px-2 leading-[18px] tracking-[-0.005em]"
                    style={{
                      color: i.urgent ? "var(--textStatusError)" : undefined,
                    }}
                  >
                    {i.title}
                  </Typography>
                </button>
              );
            })}
          </div>
          <Typography
            textStyle="helper-sm-regular"
            color="secondary"
            align="center"
          >
            AI-assisted. A person can step in any time.
          </Typography>
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
                  {PILL_ICON[a.intent] && (
                    <Icon icon={PILL_ICON[a.intent]!} size={16} />
                  )}
                  <Typography
                    textStyle="label-md-semibold"
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
                      <Typography textStyle="label-lg-semibold" as="h3">
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
              <span className="grid size-48 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface-page-secondary text-text-primary">
                {r.image ? (
                  <img
                    src={r.image}
                    alt=""
                    loading="lazy"
                    className="size-full object-contain"
                  />
                ) : (
                  r.icon && <Icon icon={r.icon} size={24} />
                )}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <Typography textStyle="label-lg-semibold" as="span">
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
                  textStyle="label-md-semibold"
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

        <form
          onSubmit={send}
          className="flex items-center gap-8 px-16 pt-8 pb-[max(12px,env(safe-area-inset-bottom))]"
        >
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Show the menu"
            className="grid size-48 shrink-0 place-items-center rounded-full border border-border-default-medium bg-surface-card-default text-text-primary active:scale-[0.96]"
          >
            <span className="inline-flex size-24" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                className="size-full"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              >
                <rect x="4" y="4" width="6.5" height="6.5" rx="1.8" />
                <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.8" />
                <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.8" />
                <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.8" />
              </svg>
            </span>
          </button>
          <div className="relative flex min-w-0 flex-1 items-center gap-8 rounded-full border border-border-default-medium bg-surface-card-default py-3 pr-3 pl-20 shadow-s focus-within:border-text-primary">
            {showHint && (
              <span className="pointer-events-none absolute inset-y-0 right-60 left-20 flex items-center">
                <RollingHint />
              </span>
            )}
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              aria-label="Message Otto"
              className="h-40 min-w-0 flex-1 bg-transparent text-[16px] text-text-primary outline-none"
            />
            <button
              type="submit"
              aria-label="Send"
              disabled={!draft.trim()}
              className="grid size-40 shrink-0 place-items-center rounded-full text-white transition-opacity disabled:opacity-55"
              style={{ backgroundColor: "var(--brandPrimary600)" }}
            >
              <span
                className="inline-flex size-20 [&_svg]:size-full"
                aria-hidden="true"
              >
                <ArrowUp />
              </span>
            </button>
          </div>
        </form>
        <MenuSheet
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onAsk={(i) => say(ASK_TEXT[i], i)}
        />
      </main>
    </div>
  );
}
