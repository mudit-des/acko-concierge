import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { ArrowUp } from "@acko/icons";
import { MicButton } from "./MicButton";

/*
 * The message box. At rest it is one slim row: the app menu, the text, the mic and send. When you tap into it,
 * start typing or start talking, it opens into a two-row card: your text on top, and below it the menu and
 * mic on the left and a sage Send pill on the right. It is the same four elements moved around (not re-created),
 * so focus is never lost when it opens or closes.
 */
export function Composer({
  onSend,
  onMenu,
}: {
  onSend: (text: string) => void;
  onMenu: () => void;
}) {
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);
  const [listening, setListening] = useState(false);
  const micBase = useRef("");
  const area = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const expanded = focused || listening || draft.length > 0;

  // The text grows with what you type, up to a few lines.
  useEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [draft, expanded]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    onSend(text);
  };
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };
  const onFocus = () => {
    window.clearTimeout(timer.current);
    setFocused(true);
  };
  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    // Wait a beat, so a tap on the menu, mic or send is not lost to the layout closing under the finger.
    timer.current = window.setTimeout(() => setFocused(false), 120);
  };

  const round =
    "grid size-40 shrink-0 place-items-center rounded-full border text-text-primary transition-[background-color,border-color,transform] duration-200 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100";
  const edge = expanded
    ? "border-border-default-strong bg-white"
    : "border-transparent";

  return (
    <form
      onSubmit={submit}
      className="px-16 pt-8 pb-[max(12px,env(safe-area-inset-bottom))]"
    >
      <div
        onFocus={onFocus}
        onBlur={onBlur}
        className={`grid items-center border border-border-default-strong bg-white shadow-m transition-colors duration-200 focus-within:border-[var(--brandPrimary600)] motion-reduce:transition-none ${
          expanded
            ? "grid-cols-[40px_40px_minmax(0,1fr)_auto] gap-8 rounded-[28px] p-12"
            : "grid-cols-[40px_minmax(0,1fr)_40px_40px] gap-x-4 rounded-full p-3"
        }`}
      >
        <button
          type="button"
          onClick={onMenu}
          aria-label="Show the menu"
          className={`${round} ${edge} ${expanded ? "col-start-1 row-start-2" : "col-start-1 row-start-1"}`}
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

        <textarea
          ref={area}
          rows={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          placeholder={listening ? "Listening..." : "Ask Otto anything..."}
          aria-label="Message Otto"
          enterKeyHint="send"
          className={`block w-full resize-none bg-transparent text-[16px] leading-[24px] text-text-primary outline-none placeholder:text-text-secondary ${
            expanded
              ? "col-span-4 col-start-1 row-start-1 min-h-[56px] px-4 py-4"
              : "col-start-2 row-start-1 min-h-[40px] px-8 py-8"
          }`}
        />

        <MicButton
          className={`${round} ${edge} ${expanded ? "col-start-2 row-start-2" : "col-start-3 row-start-1"}`}
          onStart={() => {
            micBase.current = draft ? `${draft} ` : "";
          }}
          onTranscript={(t) => setDraft(micBase.current + t)}
          onListeningChange={setListening}
        />

        <button
          type="submit"
          aria-label="Send"
          disabled={!draft.trim()}
          className={`grid h-40 place-items-center rounded-full text-white transition-[opacity,width] duration-200 disabled:opacity-55 motion-reduce:transition-none ${
            expanded
              ? "col-start-4 row-start-2 w-[72px] justify-self-end"
              : "col-start-4 row-start-1 w-40"
          }`}
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
  );
}
