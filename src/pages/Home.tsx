import { CtaBar } from "../components/CtaBar";
import { Header } from "../components/Header";
import { Services } from "../components/Services";
import { StoryCarousel } from "../components/StoryCarousel";

export default function Home() {
  return (
    <div className="min-h-svh bg-surface-page-secondary">
      <main className="mx-auto min-h-svh w-full max-w-480 bg-surface-page-primary pb-[calc(112px+env(safe-area-inset-bottom))]">
        <Header />
        <StoryCarousel />
        <Services />
      </main>
      <CtaBar />
    </div>
  );
}
