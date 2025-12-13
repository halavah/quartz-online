'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import articlesData from '@/data/articles.json';

interface Article {
  title: string;
  description: string;
  htmlFile: string;
  category: string;
}

interface NavbarProps {
  siteName: string;
  githubUrl?: string;
  articles?: Article[];
}

export default function Navbar({ siteName, githubUrl, articles = [] }: NavbarProps) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bannerVisible, setBannerVisible] = useState(true);

  // 初始化主题
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  // 主题切换处理
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // 判断当前页面
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(path);
  };

  // 搜索功能
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return articles.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.description.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query)
    ).slice(0, 8); // 最多显示8条结果
  }, [searchQuery, articles]);

  // ESC 键关闭搜索
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  return (
    <>
    <nav className="sticky top-0 z-50 backdrop-blur-lg" style={{
      background: theme === 'dark' ? 'rgba(10, 14, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      borderBottom: '1px solid var(--border-color)',
      transition: 'background-color 0.3s ease'
    }}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-2xl font-black bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              {siteName}
            </div>
          </Link>

          {/* 右侧：导航链接 + 工具栏 */}
          <div className="flex items-center gap-4 md:gap-6 flex-wrap">
  
            {/* 广告横幅 - 可关闭 */}
            {bannerVisible && (
              <div className="animate-fade-in order-first lg:order-none w-full lg:w-auto mb-2 lg:mb-0 hidden md:block">
                <a
                  href={articlesData.config.adLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block px-3 py-1.5 rounded-md text-xs md:text-sm font-medium cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #ff6b00 0%, #ff9500 100%)',
                    color: 'white',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 10px rgba(255, 107, 0, 0.3)'
                  }}
                >
                  <span className="hidden sm:inline">🔥 限时优惠：Claude Code 正版授权，立享85折</span>
                  <span className="sm:hidden">🔥 限时优惠85折</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setBannerVisible(false);
                    }}
                    className="ml-2 inline-flex items-center justify-center p-1 rounded-full bg-white/20 hover:bg-white transition-all"
                    style={{
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                      backdropFilter: 'blur(4px)',
                      width: '20px',
                      height: '20px'
                    }}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </a>
              </div>
            )}

            {/* 分割线 */}
            <div className="hidden md:block" style={{
              width: '1px',
              height: '24px',
              backgroundColor: 'var(--border-color)'
            }} />

            {/* 工具按钮组 */}
            <div className="flex items-center gap-4">
              {/* 搜索按钮 */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg hover:bg-blue-500/10 transition-all"
                style={{ color: 'var(--text-secondary)' }}
                title="搜索文章"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* 主题切换按钮 */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-blue-500/10 transition-all"
                style={{ color: 'var(--text-secondary)' }}
                title={theme === 'dark' ? '切换到明亮模式' : '切换到暗色模式'}
              >
                {theme === 'dark' ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* 移动端菜单按钮 */}
              <button className="md:hidden p-2 rounded-lg hover:bg-blue-500/10 transition-all" style={{ color: 'var(--text-secondary)' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    {/* 炫酷搜索弹窗 */}
    {searchOpen && (
      <div
        className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4"
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={() => {
          setSearchOpen(false);
          setSearchQuery('');
        }}
      >
        <div
          className="w-full max-w-3xl"
          style={{
            animation: 'slideDown 0.3s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 搜索框 */}
          <div
            className="rounded-2xl shadow-2xl overflow-hidden"
            style={{
              background: theme === 'dark'
                ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
              border: '1px solid var(--border-color)',
              backdropFilter: 'blur(20px)'
            }}
          >
            {/* 输入框区域 */}
            <div className="flex items-center gap-4 p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <svg className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索文章标题、描述或分类..."
                autoFocus
                className="flex-1 text-lg bg-transparent border-none outline-none"
                style={{
                  color: 'var(--text-color)',
                  caretColor: '#3b82f6'
                }}
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="flex-shrink-0 px-3 py-1 rounded-lg text-sm font-medium transition-all hover:bg-gray-500/10"
                style={{ color: 'var(--text-secondary)' }}
              >
                ESC
              </button>
            </div>

            {/* 搜索结果 */}
            <div className="max-h-[60vh] overflow-y-auto">
              {searchQuery.trim() && searchResults.length === 0 ? (
                <div className="p-12 text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>
                    未找到相关文章
                  </p>
                  <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
                    试试其他关键词吧
                  </p>
                </div>
              ) : searchQuery.trim() ? (
                <div className="p-2">
                  {searchResults.map((article) => (
                    <Link
                      key={article.htmlFile}
                      href={`/article/${article.htmlFile.replace('.html', '')}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="block p-4 rounded-xl transition-all hover:scale-[1.02] mb-2"
                      style={{
                        background: theme === 'dark' ? 'rgba(51, 65, 85, 0.3)' : 'rgba(241, 245, 249, 0.5)',
                        border: '1px solid transparent',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.background = theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.background = theme === 'dark' ? 'rgba(51, 65, 85, 0.3)' : 'rgba(241, 245, 249, 0.5)';
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold mb-2 truncate" style={{ color: 'var(--text-color)' }}>
                            {article.title}
                          </h3>
                          <p className="text-sm line-clamp-2 mb-2" style={{ color: 'var(--text-secondary)', opacity: 0.8 }}>
                            {article.description}
                          </p>
                          <span
                            className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                            style={{
                              background: 'rgba(59, 130, 246, 0.1)',
                              color: '#3b82f6'
                            }}
                          >
                            {article.category}
                          </span>
                        </div>
                        <svg className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: 'var(--text-secondary)', opacity: 0.5 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-secondary)', opacity: 0.3 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>
                    开始搜索
                  </p>
                  <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
                    输入关键词查找文章
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 提示信息 */}
          <div className="flex items-center justify-center gap-6 mt-4 text-sm" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>ESC</kbd>
              关闭
            </span>
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>↵</kbd>
              打开
            </span>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    )}
    </>
  );
}
