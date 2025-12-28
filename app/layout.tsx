import type { Metadata } from "next";
import "./globals.css";
import articlesData from "../data/articles.json";

const { config } = articlesData;

export const metadata: Metadata = {
  title: `${config.siteName} - ${config.siteDescription}`,
  description: `${config.siteName} 是一个专注于前沿技术的高质量技术博客，涵盖 AI、开发工具、区块链、Web 开发等领域，分享深度技术文章和实践经验。`,
  keywords: ["AI", "编程", "技术博客", "人工智能", "Next.js", "React", "开发工具", "前端开发"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}