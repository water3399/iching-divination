import { NextResponse } from 'next/server';

const systemPrompt = `你是一位易經占卜專家，請依照以下順序回答，並使用繁體中文、委婉客氣的語氣：
1. 先說明吉凶判斷
2. 解讀卦辭含義
3. 解讀爻辭含義
4. 依據使用者具體問題給出分析與可行建議`;

type InterpretRequest = {
  category: string;
  question: string;
  hexagramName: string;
  yaoName: string;
  yaoText: string;
};

type AnthropicTextBlock = {
  type: 'text';
  text: string;
};

type AnthropicResponse = {
  content?: AnthropicTextBlock[];
  error?: {
    message?: string;
  };
};

export async function POST(req: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing ANTHROPIC_API_KEY' }, { status: 500 });
    }

    const body = (await req.json()) as InterpretRequest;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 900,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `問題類別：${body.category}\n問題：${body.question}\n卦名：${body.hexagramName}\n爻位：${body.yaoName}\n爻辭：${body.yaoText}`
          }
        ]
      })
    });

    const data = (await response.json()) as AnthropicResponse;

    if (!response.ok) {
      const detail = data.error?.message ?? 'Unknown error';
      return NextResponse.json({ error: 'Interpretation failed', detail }, { status: response.status });
    }

    const text =
      data.content
        ?.filter((part) => part.type === 'text')
        .map((part) => part.text)
        .join('\n') ?? '';

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json(
      { error: 'Interpretation failed', detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
