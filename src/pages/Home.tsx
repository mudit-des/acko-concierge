import { Header } from "../components/Header";
import { Services } from "../components/Services";

export default function Home() {
  return (
    <div className="min-h-svh bg-surface-page-secondary">
      <main className="mx-auto min-h-svh w-full max-w-480 bg-surface-page-primary pb-[calc(24px+env(safe-area-inset-bottom))]">
        <Header />
        <Services />
      </main>
    </div>
  );
}
