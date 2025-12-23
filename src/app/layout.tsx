import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 换回经典的 Inter 字体
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI 智能商城",
  description: "基于 Next.js 和 Gemini AI 的智能购物体验",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
