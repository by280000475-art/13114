import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MiMo CreatorOps",
  description: "面向内容创作者的 AI 内容生产工作台。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
