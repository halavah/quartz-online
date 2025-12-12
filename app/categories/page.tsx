'use client';

import Link from 'next/link';
import articlesData from '../../data/articles.json';

export default function CategoriesPage() {
  const { config, articles } = articlesData;
  const categories = ['AI工具', '开发工具', '技术趋势', '前端框架'];

  const getCategoryArticles = (category: string) => {
    return articles.filter((article: any) => (article.category || '开发工具') === category);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--dark-bg)' }}>
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg" style={{
        background: 'rgba(10, 14, 39, 0.9)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-black" style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {config.siteName}
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/" className="text-sm hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>首页</Link>
              <Link href="/articles" className="text-sm hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>文章</Link>
              <Link href="/categories" className="text-sm hover:text-blue-400 transition-colors" style={{ color: 'var(--text-color)' }}>分类</Link>
              <Link href="/about" className="text-sm hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>关于</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.1) 0%, rgba(0, 212, 255, 0.05) 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-black mb-4" style={{
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>文章分类</h1>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>按主题浏览技术文章</p>
        </div>
      </section>

      {/* 分类卡片 */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map(category => {
            const categoryArticles = getCategoryArticles(category);
            return (
              <div key={category} className="p-8 rounded-xl" style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)'
              }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>{category}</h2>
                  <div className="px-4 py-2 rounded-full text-sm font-bold" style={{
                    background: 'var(--primary-color)',
                    color: 'white'
                  }}>
                    {categoryArticles.length} 篇
                  </div>
                </div>

                <ul className="space-y-3">
                  {categoryArticles.map((article: any) => (
                    <li key={article.htmlFile}>
                      <Link href={`/article/${article.htmlFile.replace('.html', '')}`} className="flex items-center gap-2 hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="hover:underline">{article.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
