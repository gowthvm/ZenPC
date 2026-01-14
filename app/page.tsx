import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';

export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-text-primary">
      {/* Header */}
      <header className="w-full px-6 pt-6 pb-4 flex items-center justify-between gap-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-accent/15 flex items-center justify-center font-display text-xl font-bold text-accent select-none">Z</div>
          <span className="font-display text-lg font-semibold tracking-tight">ZenPC</span>
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <a href="#features" className="hover:text-accent transition-colors">Features</a>
          <a href="#pricing" className="hover:text-accent transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-accent transition-colors">FAQ</a>
        </nav>
        <Button asChild>
          <a href="#" className="font-semibold">Get Started</a>
        </Button>
      </header>

      <main className="flex-1 w-full flex flex-col items-center px-6">
        {/* Hero */}
        <section className="w-full max-w-3xl text-center space-y-6 pt-24 pb-16">
          <h1 className="font-display text-4xl font-bold mb-2">Build Your Dream PC, Effortlessly</h1>
          <p className="text-lg text-text-muted mb-6">ZenPC is the premium builder for custom PCs. Professional, distraction-free, and always up to date.</p>
          <Button className="mt-2">Start Building</Button>
        </section>

        {/* How it works */}
        <section className="w-full max-w-4xl flex flex-col items-center gap-10 py-12">
          <h2 className="font-display text-2xl font-semibold mb-2">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="flex flex-col items-center text-center gap-3 p-6">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-accent/10 text-accent font-bold text-lg">1</div>
              <div className="font-semibold">Select Components</div>
              <div className="text-text-muted text-sm">Choose from a curated list of compatible parts.</div>
            </div>
            <div className="flex flex-col items-center text-center gap-3 p-6">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-accent/10 text-accent font-bold text-lg">2</div>
              <div className="font-semibold">Check Compatibility</div>
              <div className="text-text-muted text-sm">Instant feedback ensures your build works together.</div>
            </div>
            <div className="flex flex-col items-center text-center gap-3 p-6">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-accent/10 text-accent font-bold text-lg">3</div>
              <div className="font-semibold">Save & Revisit</div>
              <div className="text-text-muted text-sm">Save builds and return anytime—no clutter, no noise.</div>
            </div>
          </div>
        </section>

        {/* Why different */}
        <section className="w-full max-w-3xl text-center space-y-4 py-12">
          <h2 className="font-display text-2xl font-semibold mb-2">Why ZenPC?</h2>
          <p className="text-text-muted text-base">No ads. No upsells. No distractions. Just a calm, modern interface focused on clarity and trust—so you can build with confidence.</p>
        </section>

        {/* CTA */}
        <section className="w-full max-w-2xl text-center py-12">
          <Button className="text-base px-8 py-3">Get Started</Button>
        </section>
      </main>

      <footer className="w-full mt-auto px-6 pb-6 pt-8 max-w-6xl mx-auto">
        <Divider />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted pt-4">
          <div>© {new Date().getFullYear()} ZenPC. All rights reserved.</div>
          <nav className="flex gap-5">
            <a href="#about" className="hover:text-accent transition-colors">About</a>
            <a href="#privacy" className="hover:text-accent transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-accent transition-colors">Terms</a>
            <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

