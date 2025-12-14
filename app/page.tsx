'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import articlesData from '../data/articles.json';
import Pagination from './components/Pagination';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function Home() {
  const { config, articles } = articlesData;

  // 视图模式状态
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 分类筛选 - 从 articles 中自动提取所有唯一分类
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    articles.forEach((article: any) => {
      const cat = article.category || '开发工具';
      uniqueCategories.add(cat);
    });
    return ['全部', ...Array.from(uniqueCategories).sort()];
  }, [articles]);

  // 计算每个分类的文章数量
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { '全部': articles.length };
    articles.forEach((article: any) => {
      const cat = article.category || '开发工具';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [articles]);

  // 文章筛选和排序
  const filteredArticles = useMemo(() => {
    return articles.filter((article: any) => {
      // 分类匹配
      const articleCategory = article.category || '开发工具';
      const matchesCategory = selectedCategory === '全部' || articleCategory === selectedCategory;

      return matchesCategory;
    });
  }, [articles, selectedCategory]);

  // 分页设置
  const ARTICLES_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 重置分页当筛选条件改变时
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--dark-bg)', transition: 'background-color 0.3s ease' }}>
      {/* 导航栏 */}
      <Navbar
        siteName={config.siteName}
        githubUrl={(config as any).githubUrl}
        articles={articles}
      />

      {/* Hero */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.1) 0%, rgba(0, 212, 255, 0.05) 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            技术分享平台
          </h1>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>{config.siteDescription}</p>
        </div>
      </section>

      {/* 分类筛选 + 文章列表 */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* 分类筛选 */}
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
              {cat} ({categoryCounts[cat] || 0})
            </button>
          ))}
        </div>

        {/* 视图切换和文章统计 */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            共找到 {filteredArticles.length} 篇文章
          </div>

          {/* 视图切换按钮 */}
          <div className="flex items-center gap-2 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-l-lg transition-all ${
                viewMode === 'grid' ? 'bg-blue-500 text-white' : ''
              }`}
              style={{
                color: viewMode === 'grid' ? 'white' : 'var(--text-secondary)'
              }}
              title="网格视图"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-r-lg transition-all ${
                viewMode === 'list' ? 'bg-blue-500 text-white' : ''
              }`}
              style={{
                color: viewMode === 'list' ? 'white' : 'var(--text-secondary)'
              }}
              title="列表视图"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* 文章网格/列表 */}
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'} mb-12`}>
          {currentArticles.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="text-7xl mb-6">🔍</div>
              <h3 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-color)' }}>
                未找到匹配的文章
              </h3>
              <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
                尝试选择其他分类
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('全部');
                }}
                className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                style={{
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  boxShadow: '0 5px 15px rgba(0, 102, 255, 0.3)'
                }}
              >
                查看所有文章
              </button>
            </div>
          ) : (
            currentArticles.map((article: any, index: number) => {
              if (viewMode === 'grid') {
                // 网格视图
                return (
                  <Link
                    key={article.htmlFile}
                    href={`/${article.htmlFile.replace('.html', '')}`}
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
                    }}
                    className="hover:scale-105 hover:shadow-2xl"
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary-color)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 40px rgba(0, 102, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }}
                    >
                      {/* 顶部装饰线 */}
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

                      {/* 分类标签 */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs font-bold px-2 py-1 rounded" style={{
                          background: 'var(--primary-color)',
                          color: 'white'
                        }}>
                          {article.category || '开发工具'}
                        </div>
                        <div className="text-xs font-bold" style={{
                          color: 'var(--primary-color)',
                          opacity: 0.6
                        }}>
                          #{String(startIndex + index + 1).padStart(2, '0')}
                        </div>
                      </div>

                      <h2 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors" style={{
                        color: 'var(--text-color)',
                        lineHeight: 1.4
                      }}>
                        {article.title}
                      </h2>

                      <p style={{
                        color: 'var(--text-secondary)',
                        lineHeight: 1.7,
                        flexGrow: 1,
                        fontSize: '0.95rem'
                      }}>
                        {article.description}
                      </p>

                      {/* 阅读更多指示器 */}
                      <div className="flex items-center gap-2 mt-5 text-sm font-semibold group-hover:gap-4 transition-all" style={{
                        color: 'var(--primary-color)'
                      }}>
                        <span>阅读全文</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </article>
                  </Link>
                );
              } else {
                // 列表视图
                return (
                  <Link
                    key={article.htmlFile}
                    href={`/${article.htmlFile.replace('.html', '')}`}
                    className="block group"
                  >
                    <div className="p-6 rounded-lg transition-all hover:scale-[1.02] hover:shadow-xl" style={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border-color)'
                    }}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs px-2 py-1 rounded font-bold" style={{ background: 'var(--primary-color)', color: 'white' }}>
                              {article.category || '开发工具'}
                            </span>
                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>#{String(startIndex + index + 1).padStart(2, '0')}</span>
                          </div>
                          <h2 className="text-xl font-bold mb-2 hover:text-blue-400 transition-colors" style={{ color: 'var(--text-color)' }}>
                            {article.title}
                          </h2>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                            {article.description}
                          </p>
                        </div>
                        <svg className="w-6 h-6 flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform" style={{ color: 'var(--primary-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              }
            })
          )}
        </div>

        {/* 分页导航 */}
        {totalPages > 1 && currentArticles.length > 0 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
