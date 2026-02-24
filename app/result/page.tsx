'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ichingData from '@/data/iching.json';

type InterpretPayload = {
  question: string;
  category: string;
  hexagramName: string;
  hexagramNumber: number;
  yaoName: string;
  yaoPosition: number;
  yaoText: string;
};

function parseNumber(raw: string | null) {
  const n = Number(raw ?? 1);
  if (!Number.isFinite(n)) return 1;
  return Math.min(384, Math.max(1, Math.floor(n)));
}

function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    return <span key={idx}>{part}</span>;
  });
}

function renderMarkdown(md: string) {
  const lines = md.split('\n');
  const nodes: JSX.Element[] = [];
  let listItems: JSX.Element[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      nodes.push(
        <ul key={`list-${nodes.length}`} className="list-disc pl-5 space-y-1">
          {listItems}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      nodes.push(<div key={`space-${index}`} className="h-2" />);
      return;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      listItems.push(<li key={`li-${index}`}>{renderInline(trimmed.slice(2))}</li>);
      return;
    }

    flushList();
    nodes.push(
      <p key={`p-${index}`} className="leading-relaxed">
        {renderInline(trimmed)}
      </p>
    );
  });

  flushList();
  return nodes;
}

export default function ResultPage() {
  const searchParams = useSearchParams();
  const number = parseNumber(searchParams.get('number'));
  const question = searchParams.get('question') ?? '';
  const category = searchParams.get('category') ?? '未分類';

  const remainder = number % 6;
  const yaoPosition = remainder === 0 ? 6 : remainder;
  const hexagramNumber = Math.ceil(number / 6);

  const result = useMemo(
    () => ichingData.find((item) => item.hexagramNumber === hexagramNumber && item.yaoPosition === yaoPosition),
    [hexagramNumber, yaoPosition]
  );

  const [aiInterpretation, setAiInterpretation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!result || !question) {
      return;
    }

    const payload: InterpretPayload = {
      question,
      category,
      hexagramName: result.hexagramName,
      hexagramNumber: result.hexagramNumber,
      yaoName: result.yaoName,
      yaoPosition: result.yaoPosition,
      yaoText: result.yaoText
    };

    let cancelled = false;
    setLoading(true);

    fetch('/api/interpret', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async (response) => {
        if (!response.ok) {
          return null;
        }
        const data = (await response.json()) as { text?: string };
        return data.text ?? null;
      })
      .then((text) => {
        if (!cancelled) {
          setAiInterpretation(text);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAiInterpretation(null);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [category, question, result]);

  if (!result) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <p>查無卦象資料，請返回重試。</p>
      </main>
    );
  }

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
        {loading ? (
          <div className="flex items-center gap-3 text-amber-100/80">
            <span className="h-3 w-3 rounded-full bg-gold animate-ping" />
            <span>正在解讀卦象...</span>
          </div>
        ) : aiInterpretation ? (
          <div className="space-y-2">{renderMarkdown(aiInterpretation)}</div>
        ) : (
          <p className="text-amber-100/70 leading-relaxed">
            {question ? '目前無法取得 AI 解讀（請確認已設定 ANTHROPIC_API_KEY）。' : '你尚未輸入問題，本次僅顯示卦象與爻辭。'}
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
