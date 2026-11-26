import { useCallback, useState } from "react";
import { AskBar } from "../components/AskBar";
import { ConciergeChat, type ChatRequest } from "../components/ConciergeChat";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Services } from "../components/Services";
import type { IntentId } from "../data/chat";

/*
 * Home reads as a conversation first: the concierge says hello and invites a question, then
 * "or browse what we do" leads into the services. The ask bar is fixed at the bottom throughout.
 * One chat sheet serves the suggestions, the ask bar and the service tiles.
 */
export default function Home() {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState<ChatRequest>();

  const ask = useCallback((text: string, intent: IntentId) => {
    setRequest({ id: Date.now(), text, intent });
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <div className="min-h-svh bg-surface-page-secondary">
      <main className="mx-auto min-h-svh w-full max-w-480 bg-surface-page-primary pb-[calc(104px+env(safe-area-inset-bottom))]">
        <Header />
        <Hero onAsk={ask} />
        <Services onAsk={ask} />
      </main>
      <AskBar visible={!open} onOpen={() => setOpen(true)} />
      <ConciergeChat open={open} onClose={close} request={request} />
    </div>
  );
}
