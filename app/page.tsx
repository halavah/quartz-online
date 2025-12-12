'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import articlesData from '../data/articles.json';
import Pagination from './components/Pagination';

export default function Home() {
  const { config, articles } = articlesData;

  // 主题切换 - 从localStorage读取或默认为dark
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  // 初始化主题
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

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

  // 计算每个分类的文章数量
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { '全部': articles.length };
    articles.forEach((article: any) => {
      const cat = article.category || '开发工具';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [articles]);

  // 文章筛选和排序（使用 useMemo 优化性能）
  const filteredArticles = useMemo(() => {
    return articles.filter((article: any) => {
      // 搜索匹配（标题或描述）- 使用防抖后的搜索词
      const matchesSearch = debouncedSearchQuery.trim() === '' ||
        article.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      // 分类匹配 - 直接使用 article.category 字段
      const articleCategory = article.category || '开发工具';
      const matchesCategory = selectedCategory === '全部' || articleCategory === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [articles, debouncedSearchQuery, selectedCategory]);

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

  // 主题切换处理
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--dark-bg)', transition: 'background-color 0.3s ease' }}>
      {/* 顶部导航栏 */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg" style={{
        background: theme === 'dark' ? 'rgba(10, 14, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        borderBottom: '1px solid var(--border-color)',
        transition: 'background-color 0.3s ease'
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
              <Link href="/articles" className="text-sm font-medium hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                文章
              </Link>
              <Link href="/categories" className="text-sm font-medium hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                分类
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                关于
              </Link>
            </div>

            {/* 右侧工具栏 */}
            <div className="flex items-center gap-4">
              {/* 搜索按钮 */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-lg hover:bg-blue-500/10 transition-all"
                style={{ color: isSearchOpen ? 'var(--primary-color)' : 'var(--text-secondary)' }}
                title="搜索"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* GitHub 链接 */}
              <a
                href={(config as any).githubUrl || "https://github.com/halavah"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-blue-500/10 transition-all"
                style={{ color: 'var(--text-secondary)' }}
                title="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
              </a>

              {/* 主题切换按钮 */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-blue-500/10 transition-all"
                style={{ color: 'var(--text-secondary)' }}
                title={theme === 'dark' ? '切换到明亮模式' : '切换到暗色模式'}
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
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
            <div className="mt-4">
              <input
                type="text"
                placeholder="搜索文章标题或描述..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-color)'
                }}
              />
              {searchQuery && (
                <div className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  找到 {filteredArticles.length} 篇相关文章
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero 区域 */}
      <section className="relative overflow-hidden py-20" style={{
        background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.1) 0%, rgba(0, 212, 255, 0.05) 100%)'
      }}>
        {/* 网格背景 */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-black mb-6" style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {config.siteName}
            </h1>
            <p className="text-xl md:text-2xl mb-8" style={{ color: 'var(--text-secondary)' }}>
              {config.siteDescription}
            </p>

            {/* CTA 按钮 */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                className="px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                style={{
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  boxShadow: '0 10px 30px rgba(0, 102, 255, 0.3)'
                }}
              >
                开始阅读
              </button>
              <a
                href={(config as any).githubUrl || "https://github.com/halavah"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-color)'
                }}
              >
                查看 GitHub
              </a>
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-3 gap-8 mt-12 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold" style={{ color: 'var(--primary-color)' }}>
                  {articles.length}+
                </div>
                <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  优质文章
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ color: 'var(--primary-color)' }}>
                  {categories.length - 1}+
                </div>
                <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  技术分类
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ color: 'var(--primary-color)' }}>
                  ∞
                </div>
                <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  持续更新
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* 分类筛选栏 */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(category => {
              const count = categoryCounts[category] || 0;
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="px-6 py-2 rounded-full font-medium transition-all hover:scale-105"
                  style={{
                    background: isActive ? 'var(--gradient-primary)' : 'var(--card-bg)',
                    border: `1px solid ${isActive ? 'transparent' : 'var(--border-color)'}`,
                    color: isActive ? 'white' : 'var(--text-secondary)',
                    boxShadow: isActive ? '0 5px 15px rgba(0, 102, 255, 0.3)' : 'none'
                  }}
                >
                  {category} ({count})
                </button>
              );
            })}
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
            currentArticles.map((article: any, index: number) => (
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
            ))
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

      {/* 页脚 */}
      <footer style={{
        background: 'var(--card-bg)',
        borderTop: '1px solid var(--border-color)',
        marginTop: '5rem'
      }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* 关于我们 */}
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-color)' }}>
                关于我们
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                {config.siteDescription}
              </p>
            </div>

            {/* 快速链接 */}
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-color)' }}>
                快速链接
              </h3>
              <ul className="space-y-2">
                {['首页', '文章', '分类', '关于'].map(item => (
                  <li key={item}>
                    <Link href="/" className="hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 资源 */}
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-color)' }}>
                资源
              </h3>
              <ul className="space-y-2">
                {['文档', 'API', '社区', '博客'].map(item => (
                  <li key={item}>
                    <Link href="/" className="hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 关注我们 */}
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-color)' }}>
                关注我们
              </h3>
              <div className="flex gap-4">
                <a href={(config as any).githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* 版权信息 */}
          <div className="mt-12 pt-8 text-center" style={{
            borderTop: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem'
          }}>
            <p>© 2025 {config.siteName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
