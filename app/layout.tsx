import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '易經互動占卜',
  description: '以六十四卦與爻辭，給你溫和且深度的指引'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
