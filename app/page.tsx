'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import articlesData from '../data/articles.json';
import Pagination from './components/Pagination';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function Home() {
  const { config, articles } = articlesData;

  // 视图模式状态 - 从配置中读取默认值
  const [viewMode, setViewMode] = useState<'table' | 'list'>(
    (config as any).defaultViewMode === 'list' ? 'list' : 'table'
  );

  // 中文拼音首字母排序函数
  const sortByPinyin = (categories: string[]): string[] => {
    const pinyinMap: Record<string, string> = {
      '安': 'A',
      '其': 'Q',
      '使': 'S'
    };

    return categories.sort((a, b) => {
      // 获取每个分类的第一个字的拼音首字母
      const getFirstLetter = (str: string): string => {
        const firstChar = str.charAt(0);
        return pinyinMap[firstChar] || firstChar.toUpperCase();
      };

      const letterA = getFirstLetter(a);
      const letterB = getFirstLetter(b);

      // 按字母顺序排序
      if (letterA < letterB) return -1;
      if (letterA > letterB) return 1;

      // 相同首字母时的排序规则
      if (letterA === letterB) {
        // 对于"使用技巧"和"使用工具"，保持固定顺序
        if (a === '使用技巧') return -1;
        if (b === '使用技巧') return 1;
      }

      return 0;
    });
  };

  // 分类筛选 - 从 articles 中自动提取所有唯一分类
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    articles.forEach((article: any) => {
      const cat = article.category || '开发工具';
      uniqueCategories.add(cat);
    });
    const categoryArray = Array.from(uniqueCategories);
    const sortedCategories = sortByPinyin(categoryArray);
    // 确保"全部"始终在最前面，然后按拼音排序其他分类
    return ['全部', ...sortedCategories];
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
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 rounded-l-lg transition-all ${
                viewMode === 'table' ? 'bg-blue-500 text-white' : ''
              }`}
              style={{
                color: viewMode === 'table' ? 'white' : 'var(--text-secondary)'
              }}
              title="表格视图"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
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
        <div className={`${viewMode === 'table' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'} mb-12`}>
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
          ) : viewMode === 'table' ? (
            // 表格视图
            <div className="w-full overflow-hidden rounded-lg border" style={{ borderColor: 'var(--border-color)', background: 'var(--card-bg)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--dark-bg)', borderBottom: `1px solid var(--border-color)` }}>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                      标题
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                      描述
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                      分类
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentArticles.map((article: any, index: number) => (
                    <tr
                      key={article.htmlFile}
                      className="hover:bg-blue-500/10 transition-colors cursor-pointer group"
                      style={{ borderBottom: `1px solid var(--border-color)` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {String(startIndex + index + 1).padStart(2, '0')}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/${article.htmlFile.replace('.html', '')}`}
                          className="text-sm font-semibold group-hover:text-blue-400 transition-colors"
                          style={{ color: 'var(--text-color)' }}
                        >
                          {article.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <div className="max-w-xs truncate">
                          {article.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-bold px-2 py-1 rounded" style={{
                          background: 'var(--primary-color)',
                          color: 'white'
                        }}>
                          {article.category || '开发工具'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/${article.htmlFile.replace('.html', '')}`}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded transition-all hover:gap-3"
                          style={{
                            background: 'var(--gradient-primary)',
                            color: 'white'
                          }}
                        >
                          <span>查看</span>
                          <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // 列表视图（垂直布局）
            currentArticles.map((article: any, index: number) => (
              <Link
                key={article.htmlFile}
                href={`/${article.htmlFile.replace('.html', '')}`}
                className="group block"
              >
                <article
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '1rem',
                    padding: '1.5rem 2rem',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem'
                  }}
                  className="hover:scale-[1.02] hover:shadow-xl"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary-color)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(0, 102, 255, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  {/* 序号 */}
                  <div className="flex-shrink-0 text-2xl font-bold" style={{
                    color: 'var(--primary-color)',
                    opacity: 0.2,
                    minWidth: '3rem'
                  }}>
                    {String(startIndex + index + 1).padStart(2, '0')}
                  </div>

                  {/* 主要内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold group-hover:text-blue-400 transition-colors" style={{
                        color: 'var(--text-color)',
                        lineHeight: 1.4
                      }}>
                        {article.title}
                      </h2>
                      <span className="text-xs font-bold px-2 py-1 rounded flex-shrink-0" style={{
                        background: 'var(--primary-color)',
                        color: 'white'
                      }}>
                        {article.category || '开发工具'}
                      </span>
                    </div>
                    <p style={{
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      fontSize: '0.95rem'
                    }}>
                      {article.description}
                    </p>
                  </div>

                  {/* 箭头指示器 */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:scale-110 group-hover:translate-x-1" style={{
                      background: 'var(--gradient-primary)',
                      color: 'white'
                    }}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
