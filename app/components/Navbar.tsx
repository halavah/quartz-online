'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  siteName: string;
  githubUrl?: string;
}

export default function Navbar({ siteName, githubUrl }: NavbarProps) {
  const pathname = usePathname();
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

  return (
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
              {siteName}
            </div>
          </Link>

          {/* 中间导航链接 */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-base font-medium hover:text-blue-400 transition-colors"
              style={{ color: isActive('/') ? 'var(--text-color)' : 'var(--text-secondary)' }}
            >
              首页
            </Link>
            <Link
              href="/articles"
              className="text-base font-medium hover:text-blue-400 transition-colors"
              style={{ color: isActive('/articles') ? 'var(--text-color)' : 'var(--text-secondary)' }}
            >
              文章
            </Link>
            <Link
              href="/categories"
              className="text-base font-medium hover:text-blue-400 transition-colors"
              style={{ color: isActive('/categories') ? 'var(--text-color)' : 'var(--text-secondary)' }}
            >
              分类
            </Link>
            <Link
              href="/about"
              className="text-base font-medium hover:text-blue-400 transition-colors"
              style={{ color: isActive('/about') ? 'var(--text-color)' : 'var(--text-secondary)' }}
            >
              关于
            </Link>
          </div>

          {/* 右侧工具栏 */}
          <div className="flex items-center gap-4">
            {/* GitHub 链接 */}
            <a
              href={githubUrl || "https://github.com/halavah"}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-blue-500/10 transition-all"
              style={{ color: 'var(--text-secondary)' }}
              title="GitHub"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
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
    </nav>
  );
}
