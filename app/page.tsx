'use client';

import { useState } from 'react';
import Link from 'next/link';
import articlesData from '../data/articles.json';
import Pagination from './components/Pagination';

export default function Home() {
  const { config, articles } = articlesData;

  // 文章排序：按 ID 顺序（可以根据需要调整）
  const sortedArticles = [...articles];

  // 分页设置
  const ARTICLES_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(sortedArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const currentArticles = sortedArticles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - 固定头部，占满整个宽度 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="w-full px-6 py-8">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight text-center">
            {config.siteName}
          </h1>
          <p className="mt-2 text-xl text-gray-600 font-light text-center max-w-2xl mx-auto">
            {config.siteDescription}
          </p>
        </div>
      </header>

      {/* 占位符 - 防止内容被固定头部遮挡 */}
      <div className="h-36"></div>

      {/* Main Content */}
      <main className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {currentArticles.map((article, index) => (
              <Link
                key={article.htmlFile}
                href={`/article/${article.htmlFile.replace('.html', '')}`}
                className="block hover:bg-gray-50 transition-colors"
              >
                <article className={`px-8 py-7 ${index !== currentArticles.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <h2 className="text-2xl font-semibold text-gray-900 hover:text-blue-600 transition-colors leading-tight">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 line-clamp-2 leading-relaxed mt-3">
                    {article.description}
                  </p>
                </article>
              </Link>
            ))}
          </div>

          {/* 分页导航 */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-gray-100">
        <div className="w-full px-6 py-12">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} {config.siteName}
          </p>
        </div>
      </footer>
    </div>
  );
}