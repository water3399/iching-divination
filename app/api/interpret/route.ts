import { NextResponse } from 'next/server';

const systemPrompt = `你是一位精通易經的占卜專家，具備深厚的命理知識與心理學素養。請根據用戶的問題和卜出的卦爻，提供完整的解讀。

請按以下格式回答，使用繁體中文：

1. **卦辭**
顯示該卦的卦辭原文。

2. **爻辭**
顯示該爻的爻辭原文。

3. **吉凶判斷**
用一個 emoji + 簡短判斷（如 🌟 吉卦、⚠️ 凶卦、☯️ 中性卦等），並用一句話描述整體象意。

4. **卦辭解讀（整體分析）**
解釋卦的整體含義，並結合用戶的具體問題分析。用條列式列出 4-5 個重點。

5. **爻辭解讀（具體指引）**
解釋該爻的含義與在卦中的位置意義，結合問題給出具體建議。

6. **💡 特別提醒**
給出 1-2 個具體的行動建議或注意事項。

7. **總結**
用條列式列出幾個關鍵判斷（如趨勢、時機、貴人等），最後用一句話做結語（用 👉 開頭）。

語氣要求：委婉、溫暖、有智慧，像一位值得信賴的長者在給建議。不要過於武斷，給用戶正面的指引方向。`;

type InterpretRequest = {
  question: string;
  category: string;
  hexagramName: string;
  hexagramNumber: number;
  yaoName: string;
  yaoPosition: number;
  yaoText: string;
};

type OpenRouterResponse = {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
  error?: {
    message?: string;
  };
};

const openRouterBaseUrl = 'https://openrouter.ai/api/v1';
const defaultModel = 'openai/gpt-4o-mini';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL ?? defaultModel;

    if (!apiKey) {
      return NextResponse.json({ error: 'Missing OPENROUTER_API_KEY' }, { status: 500 });
    }

    const body = (await req.json()) as InterpretRequest;

    const response = await fetch(`${openRouterBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL ?? 'http://localhost:3000',
        'X-Title': process.env.OPENROUTER_SITE_NAME ?? 'I Ching Divination'
      },
      body: JSON.stringify({
        model,
        max_tokens: 1200,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content:
              `問題類別：${body.category}\n` +
              `問題：${body.question}\n` +
              `卦序：第${body.hexagramNumber}卦\n` +
              `卦名：${body.hexagramName}\n` +
              `爻位：第${body.yaoPosition}爻（${body.yaoName}）\n` +
              `爻辭：${body.yaoText}`
          }
        ]
      })
    });

    const data = (await response.json()) as OpenRouterResponse;

    if (!response.ok) {
      const detail = data.error?.message ?? 'Unknown error';
      return NextResponse.json({ error: 'Interpretation failed', detail }, { status: response.status });
    }

    const text = data.choices?.[0]?.message?.content ?? '';

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json(
      { error: 'Interpretation failed', detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
