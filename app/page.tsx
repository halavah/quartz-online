'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import articlesData from '../data/articles.json';
import Pagination from './components/Pagination';

export default function Home() {
  const { config, articles } = articlesData;

  // 分类筛选
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const categories = ['全部', 'AI工具', '开发工具', '技术趋势', '前端框架'];

  // 搜索功能
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 搜索防抖（300ms）
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 智能推断文章分类（根据标题关键词）
  const inferCategory = useCallback((title: string): string => {
    const titleLower = title.toLowerCase();

    // AI工具：包含 AI、智能、Bytebot、Onyx 等关键词
    if (/ai|智能|bytebot|onyx/i.test(title)) {
      return 'AI工具';
    }

    // 前端框架：包含 React、TypeScript、Next 等关键词
    if (/react|typescript|next\.?js|前端/i.test(title)) {
      return '前端框架';
    }

    // 技术趋势：包含 Web3、趋势、2025 等关键词
    if (/web3|趋势|2025|未来/i.test(title)) {
      return '技术趋势';
    }

    // 开发工具：包含 Xget、Claude、Profiler、Radar、工具 等关键词
    if (/xget|claude|profiler|radar|tracy|工具/i.test(title)) {
      return '开发工具';
    }

    // 默认归类为开发工具
    return '开发工具';
  }, []);

  // 文章筛选和排序（使用 useMemo 优化性能）
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      // 搜索匹配（标题或描述）- 使用防抖后的搜索词
      const matchesSearch = debouncedSearchQuery.trim() === '' ||
        article.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      // 分类匹配
      const articleCategory = inferCategory(article.title);
      const matchesCategory = selectedCategory === '全部' || articleCategory === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [articles, debouncedSearchQuery, selectedCategory, inferCategory]);

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
  }, [selectedCategory, debouncedSearchQuery]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--dark-bg)' }}>
      {/* 顶部导航栏 */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg" style={{
        background: 'rgba(10, 14, 39, 0.9)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="text-2xl font-black" style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {config.siteName}
              </div>
            </Link>

            {/* 中间导航链接 */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium hover:text-blue-400 transition-colors" style={{ color: 'var(--text-color)' }}>
                首页
              </Link>
              <Link href="/" className="text-sm font-medium hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                文章
              </Link>
              <Link href="/" className="text-sm font-medium hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                分类
              </Link>
              <Link href="/" className="text-sm font-medium hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                关于
              </Link>
            </div>

            {/* 右侧工具栏 */}
            <div className="flex items-center gap-4">
              {/* 搜索按钮 */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-lg hover:bg-blue-500/10 transition-all"
                style={{ color: 'var(--text-secondary)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* GitHub 链接 */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-blue-500/10 transition-all"
                style={{ color: 'var(--text-secondary)' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
              </a>

              {/* RSS 订阅 */}
              <button
                className="p-2 rounded-lg hover:bg-blue-500/10 transition-all"
                style={{ color: 'var(--text-secondary)' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z"/>
                </svg>
              </button>

              {/* 主题切换按钮（占位，当前只有深色主题） */}
              <button
                className="p-2 rounded-lg hover:bg-blue-500/10 transition-all"
                style={{ color: 'var(--text-secondary)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>

              {/* 移动端菜单按钮 */}
              <button className="md:hidden p-2 rounded-lg hover:bg-blue-500/10 transition-all" style={{ color: 'var(--text-secondary)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* 搜索栏展开 */}
          {isSearchOpen && (
            <div className="mt-4 animate-fadeIn">
              <input
                type="text"
                placeholder="搜索文章..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-color)'
                }}
              />
            </div>
          )}
        </div>
      </nav>

      {/* 英雄区域 */}
      <header className="relative overflow-hidden" style={{
        background: 'var(--gradient-hero)',
        padding: '8rem 2rem 5rem'
      }}>
        {/* 装饰性背景 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 50%, rgba(0, 102, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(0, 212, 255, 0.15) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }} />

        {/* 网格背景 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(rgba(0, 212, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          pointerEvents: 'none'
        }} />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-block mb-6 px-5 py-2 rounded-full text-sm font-semibold" style={{
            background: 'rgba(0, 102, 255, 0.2)',
            color: 'var(--secondary-color)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            🚀 探索技术前沿
          </div>

          <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tight" style={{
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.1
          }}>
            {config.siteName}
          </h1>

          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            {config.siteDescription}
          </p>

          {/* CTA 按钮 */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
              className="px-8 py-3 rounded-lg font-semibold text-white transition-all hover:scale-105"
              style={{
                background: 'var(--gradient-primary)',
                boxShadow: '0 10px 30px rgba(0, 102, 255, 0.3)'
              }}
            >
              开始阅读
            </button>
            <button
              className="px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-color)'
              }}
            >
              了解更多
            </button>
          </div>

          {/* 统计数据 */}
          <div className="flex justify-center gap-12 flex-wrap">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {articles.length}+
              </div>
              <div className="text-sm uppercase tracking-wider font-medium" style={{ color: 'var(--text-secondary)' }}>
                精选文章
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                100%
              </div>
              <div className="text-sm uppercase tracking-wider font-medium" style={{ color: 'var(--text-secondary)' }}>
                原创内容
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                24/7
              </div>
              <div className="text-sm uppercase tracking-wider font-medium" style={{ color: 'var(--text-secondary)' }}>
                持续更新
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main style={{ padding: '4rem 2rem' }}>
        <div className="max-w-7xl mx-auto">
          {/* 分类筛选栏 */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
                最新文章
              </h2>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                共 {filteredArticles.length} 篇
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="px-5 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                  style={{
                    background: selectedCategory === category ? 'var(--gradient-primary)' : 'var(--card-bg)',
                    color: selectedCategory === category ? 'white' : 'var(--text-secondary)',
                    border: `1px solid ${selectedCategory === category ? 'transparent' : 'var(--border-color)'}`,
                    boxShadow: selectedCategory === category ? '0 5px 15px rgba(0, 102, 255, 0.3)' : 'none'
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* 文章网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {currentArticles.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <div className="text-7xl mb-6">🔍</div>
                <h3 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-color)' }}>
                  未找到匹配的文章
                </h3>
                <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
                  尝试调整搜索关键词或选择其他分类
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('全部');
                  }}
                  className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                  style={{
                    background: 'var(--gradient-primary)',
                    color: 'white',
                    boxShadow: '0 5px 15px rgba(0, 102, 255, 0.3)'
                  }}
                >
                  清除所有筛选
                </button>
              </div>
            ) : (
              currentArticles.map((article, index) => (
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

                    {/* 文章编号 */}
                    <div className="text-xs font-bold mb-3" style={{
                      color: 'var(--primary-color)',
                      opacity: 0.6
                    }}>
                      #{String(startIndex + index + 1).padStart(2, '0')}
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
              ))
            )}
          </div>

          {/* 分页导航 */}
          {totalPages > 1 && (
            <div className="flex justify-center">
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
        marginTop: '5rem'
      }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* 关于 */}
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-color)' }}>
                {config.siteName}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {config.siteDescription}
              </p>
            </div>

            {/* 快速链接 */}
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-color)' }}>
                快速链接
              </h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-sm hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>首页</Link></li>
                <li><Link href="/" className="text-sm hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>文章列表</Link></li>
                <li><Link href="/" className="text-sm hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>分类浏览</Link></li>
                <li><Link href="/" className="text-sm hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>关于我们</Link></li>
              </ul>
            </div>

            {/* 资源 */}
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-color)' }}>
                资源
              </h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-sm hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>开发文档</Link></li>
                <li><Link href="/" className="text-sm hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>API 参考</Link></li>
                <li><Link href="/" className="text-sm hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>使用条款</Link></li>
                <li><Link href="/" className="text-sm hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>隐私政策</Link></li>
              </ul>
            </div>

            {/* 社交媒体 */}
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-color)' }}>
                关注我们
              </h3>
              <div className="flex gap-3">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg hover:bg-blue-500/10 transition-all" style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg hover:bg-blue-500/10 transition-all" style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="/" className="p-3 rounded-lg hover:bg-blue-500/10 transition-all" style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* 版权信息 */}
          <div className="pt-8 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                © {new Date().getFullYear()} {config.siteName}. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link href="/" className="text-sm hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                  隐私政策
                </Link>
                <Link href="/" className="text-sm hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                  使用条款
                </Link>
                <Link href="/" className="text-sm hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                  Cookie 政策
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}