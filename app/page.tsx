'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import articlesData from '../data/articles.json';
import Pagination from './components/Pagination';

export default function Home() {
  const { config, articles } = articlesData;

  // 文章排序：按 ID 顺序（可以根据需要调整）
  const sortedArticles = [...articles];

  // 分页设置
  const ARTICLES_PER_PAGE = 6;
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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--dark-bg)' }}>
      {/* 英雄区域 */}
      <header className="relative overflow-hidden" style={{
        background: 'var(--gradient-hero)',
        padding: '6rem 2rem 4rem'
      }}>
        {/* 背景效果 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 50%, rgba(0, 102, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }} />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-block mb-4 px-4 py-2 rounded-full text-sm font-semibold" style={{
            background: 'rgba(0, 102, 255, 0.2)',
            color: 'var(--secondary-color)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            🚀 技术前沿
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tight" style={{
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.2
          }}>
            {config.siteName}
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            {config.siteDescription}
          </p>

          {/* 统计数据 */}
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {articles.length}+
              </div>
              <div className="text-sm uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                精选文章
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                100%
              </div>
              <div className="text-sm uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                原创内容
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main style={{ padding: '3rem 2rem' }}>
        <div className="max-w-6xl mx-auto">
          {/* 文章网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentArticles.map((article, index) => (
              <Link
                key={article.htmlFile}
                href={`/article/${article.htmlFile.replace('.html', '')}`}
                className="group block"
              >
                <article style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '1rem',
                  padding: '2rem',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* 悬浮效果前的线 */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'var(--gradient-primary)',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.3s ease'
                  }} className="group-hover:scale-x-100" />

                  <h2 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors" style={{
                    color: 'var(--text-color)',
                    lineHeight: 1.4
                  }}>
                    {article.title}
                  </h2>
                  <p style={{
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    flexGrow: 1
                  }}>
                    {article.description}
                  </p>

                  {/* 阅读更多指示器 */}
                  <div className="flex items-center gap-2 mt-4 text-sm font-semibold" style={{
                    color: 'var(--primary-color)',
                    transition: 'gap 0.3s ease'
                  }}>
                    <span>阅读更多</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* 分页导航 */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </main>

      {/* 页脚 */}
      <footer style={{
        background: 'var(--card-bg)',
        borderTop: '1px solid var(--border-color)',
        padding: '3rem 2rem',
        marginTop: '5rem'
      }}>
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            © {new Date().getFullYear()} {config.siteName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}