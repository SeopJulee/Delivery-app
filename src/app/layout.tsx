import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: '부경이츠 🛵 | 컴퓨터과학개론 기말 프로젝트',
  description: 'AI 도구로 구축하고 Vercel로 배포하는 Next.js 풀스택 배달 애플리케이션',
};

export default function RootLayout({
  children,
  ...props
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
