import { DivinationForm } from '@/components/DivinationForm';

export default function HomePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 md:py-16 space-y-8">
      <header className="text-center space-y-3">
        <p className="text-gold tracking-[0.35em] text-xs">ICHING DIVINATION</p>
        <h1 className="text-3xl md:text-5xl font-bold">易經互動占卜</h1>
        <p className="text-amber-100/80">以古老智慧映照當下抉擇，給你清明、穩定與方向。</p>
      </header>
      <DivinationForm />
    </main>
  );
}
