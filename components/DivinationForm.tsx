'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const categories = ['姻緣感情', '健康求醫', '事業工作', '求財運', '學業考運', '其他'];

export function DivinationForm() {
  const router = useRouter();
  const [category, setCategory] = useState(categories[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [question, setQuestion] = useState('');
  const [model, setModel] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isCasting, setIsCasting] = useState(false);

  const effectiveCategory = category === '其他' ? customCategory.trim() : category;

  const onCast = async () => {
    if (!effectiveCategory || !question.trim()) {
      alert('請先選擇類別並輸入具體問題。');
      return;
    }
    setIsCasting(true);
    const randomNumber = Math.floor(Math.random() * 384) + 1;
    await new Promise((resolve) => setTimeout(resolve, 1800));
    const params = new URLSearchParams({
      number: String(randomNumber),
      category: effectiveCategory,
      question: question.trim(),
      model: model.trim(),
      apiKey: apiKey.trim()
    });
    router.push(`/result?${params.toString()}`);
  };

  return (
    <section className="panel p-6 md:p-8 space-y-5">
      <div>
        <h2 className="text-xl md:text-2xl text-gold mb-3">靜心占問</h2>
        <p className="text-sm text-amber-100/80 leading-relaxed">
          占問前請先沉澱心緒，誠心專注一件事。心誠則靈，同一問題不宜短時間重複占卜。
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-amber-200">問題類別</label>
        <select
          className="w-full rounded-lg bg-black/30 border border-amber-200/30 px-3 py-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {category === '其他' && (
        <div className="space-y-2">
          <label className="text-sm text-amber-200">其他類別名稱</label>
          <input
            className="w-full rounded-lg bg-black/30 border border-amber-200/30 px-3 py-2"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="請輸入類別"
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm text-amber-200">具體問題</label>
        <textarea
          className="w-full rounded-lg bg-black/30 border border-amber-200/30 px-3 py-2 min-h-28"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="例如：我該不該在今年換工作？"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-amber-200">自訂模型（選填）</label>
        <input
          className="w-full rounded-lg bg-black/30 border border-amber-200/30 px-3 py-2"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="例如：openai/gpt-4o-mini"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-amber-200">API Key（選填）</label>
        <input
          type="password"
          className="w-full rounded-lg bg-black/30 border border-amber-200/30 px-3 py-2"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="若留空則使用伺服器預設金鑰"
        />
        <p className="text-xs text-amber-100/70">輸入後可用於本次占卜連線，離開頁面後不會保存。</p>
      </div>

      <button
        className="w-full rounded-xl py-3 font-semibold tracking-widest bg-gold text-black hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onCast}
        disabled={isCasting}
      >
        {isCasting ? '卜卦中...' : '開始卜卦'}
      </button>

      {isCasting && (
        <div className="flex justify-center py-3">
          <div className="h-16 w-16 rounded-full border-4 border-gold/70 border-t-transparent animate-spin shadow-aura" />
        </div>
      )}
    </section>
  );
}
