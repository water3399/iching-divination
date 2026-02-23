import Image from 'next/image';
import Link from 'next/link';
import ichingData from '@/data/iching.json';

function parseNumber(searchParams: { [key: string]: string | string[] | undefined }) {
  const n = Number(searchParams.number ?? 1);
  if (!Number.isFinite(n)) return 1;
  return Math.min(384, Math.max(1, Math.floor(n)));
}

async function interpret(payload: {
  question: string;
  category: string;
  hexagramName: string;
  yaoName: string;
  yaoText: string;
}) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/interpret`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store'
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { text?: string };
    return data.text ?? null;
  } catch {
    return null;
  }
}

export default async function ResultPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const number = parseNumber(searchParams);
  const question = String(searchParams.question ?? '');
  const category = String(searchParams.category ?? '未分類');

  const hexagramNumber = Math.ceil(number / 6);
  const remainder = number % 6;
  const yaoPosition = remainder === 0 ? 6 : remainder;

  const result = ichingData.find(
    (item) => item.hexagramNumber === hexagramNumber && item.yaoPosition === yaoPosition
  );

  if (!result) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <p>查無卦象資料，請返回重試。</p>
      </main>
    );
  }

  const aiInterpretation =
    question && process.env.ANTHROPIC_API_KEY
      ? await interpret({
          question,
          category,
          hexagramName: result.hexagramName,
          yaoName: result.yaoName,
          yaoText: result.yaoText
        })
      : null;

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <section className="panel p-6 space-y-5">
        <p className="text-xs text-gold">隨機數字：{number}</p>
        <h1 className="text-3xl font-bold">
          第{result.hexagramNumber}卦・{result.hexagramName}
        </h1>
        <p className="text-amber-200">{result.yaoName}</p>

        <div className="relative h-40 w-40 mx-auto">
          <Image src={result.imageUrl} alt={`${result.hexagramName}卦象`} fill className="object-contain" />
        </div>

        <article className="rounded-xl bg-black/25 border border-amber-300/20 p-4 leading-relaxed whitespace-pre-wrap">
          {result.yaoText}
        </article>
      </section>

      <section className="panel p-6 space-y-3">
        <h2 className="text-xl text-gold">AI 解讀</h2>
        {aiInterpretation ? (
          <p className="leading-relaxed whitespace-pre-wrap">{aiInterpretation}</p>
        ) : (
          <p className="text-amber-100/70 leading-relaxed">
            {question
              ? '目前無法取得 AI 解讀（請確認已設定 ANTHROPIC_API_KEY 與 NEXT_PUBLIC_BASE_URL）。'
              : '你尚未輸入問題，本次僅顯示卦象與爻辭。'}
          </p>
        )}
      </section>

      <div className="text-center">
        <Link href="/" className="text-gold underline-offset-4 hover:underline">
          返回首頁重新占卜
        </Link>
      </div>
    </main>
  );
}
