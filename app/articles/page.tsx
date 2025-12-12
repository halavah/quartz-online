'use client';

import Link from 'next/link';
import { useState } from 'react';
import articlesData from '../../data/articles.json';
import Navbar from '../components/Navbar';

export default function ArticlesPage() {
  const { config, articles } = articlesData;
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const categories = ['全部', 'AI工具', '开发工具', '技术趋势', '前端框架'];

  const filteredArticles = articles.filter((article: any) => {
    if (selectedCategory === '全部') return true;
    return (article.category || '开发工具') === selectedCategory;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--dark-bg)', transition: 'background-color 0.3s ease' }}>
      {/* 导航栏 */}
      <Navbar siteName={config.siteName} githubUrl={(config as any).githubUrl} />

      {/* Hero */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.1) 0%, rgba(0, 212, 255, 0.05) 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-black mb-4" style={{
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>所有文章</h1>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>共 {articles.length} 篇优质技术文章</p>
        </div>
      </section>

      {/* 分类筛选 */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-6 py-2 rounded-full font-medium transition-all hover:scale-105"
              style={{
                background: selectedCategory === cat ? 'var(--gradient-primary)' : 'var(--card-bg)',
                border: `1px solid ${selectedCategory === cat ? 'transparent' : 'var(--border-color)'}`,
                color: selectedCategory === cat ? 'white' : 'var(--text-secondary)',
                boxShadow: selectedCategory === cat ? '0 5px 15px rgba(0, 102, 255, 0.3)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 文章列表 */}
        <div className="space-y-4">
          {filteredArticles.map((article: any, index: number) => (
            <Link key={article.htmlFile} href={`/article/${article.htmlFile.replace('.html', '')}`}>
              <div className="p-6 rounded-lg transition-all hover:scale-102 hover:shadow-xl" style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)'
              }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs px-2 py-1 rounded font-bold" style={{ background: 'var(--primary-color)', color: 'white' }}>
                        {article.category || '开发工具'}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>#{index + 1}</span>
                    </div>
                    <h2 className="text-xl font-bold mb-2 hover:text-blue-400 transition-colors" style={{ color: 'var(--text-color)' }}>
                      {article.title}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{article.description}</p>
                  </div>
                  <svg className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--primary-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
