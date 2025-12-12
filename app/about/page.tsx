'use client';

import Link from 'next/link';
import articlesData from '../../data/articles.json';

export default function AboutPage() {
  const { config } = articlesData;

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
              <Link href="/categories" className="text-sm hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>分类</Link>
              <Link href="/about" className="text-sm hover:text-blue-400 transition-colors" style={{ color: 'var(--text-color)' }}>关于</Link>
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
          }}>关于我们</h1>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>致力于分享前沿技术，提升开发效率</p>
        </div>
      </section>

      {/* 主内容 */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* 项目介绍 */}
          <section className="p-8 rounded-xl" style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)'
          }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>项目介绍</h2>
            <p className="mb-4" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              {config.siteName} 是一个专注于前沿技术分享的平台，我们致力于为开发者提供高质量的技术文章、工具推荐和最佳实践。
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              我们的内容涵盖 AI 工具、开发工具、技术趋势、前端框架等多个领域，帮助开发者紧跟技术发展脉搏，提升开发效率和技术能力。
            </p>
          </section>

          {/* 内容分类 */}
          <section className="p-8 rounded-xl" style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)'
          }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>内容分类</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'AI工具', desc: '最新的 AI 辅助开发工具和平台', icon: '🤖' },
                { name: '开发工具', desc: '提升效率的开发辅助工具', icon: '🛠️' },
                { name: '技术趋势', desc: '关注技术发展动向和未来趋势', icon: '📈' },
                { name: '前端框架', desc: 'React、TypeScript、Next.js 等前端技术', icon: '⚛️' }
              ].map(cat => (
                <div key={cat.name} className="p-4 rounded-lg" style={{
                  background: 'rgba(0, 102, 255, 0.05)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <h3 className="font-bold mb-1" style={{ color: 'var(--text-color)' }}>{cat.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{cat.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 联系方式 */}
          <section className="p-8 rounded-xl" style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)'
          }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>联系我们</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" style={{ color: 'var(--primary-color)' }} fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
                <a href={(config as any).githubUrl || 'https://github.com/halavah'} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                  GitHub: {(config as any).githubUrl || 'https://github.com/halavah'}
                </a>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center py-8">
            <Link href="/articles" className="inline-block px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105" style={{
              background: 'var(--gradient-primary)',
              color: 'white',
              boxShadow: '0 10px 30px rgba(0, 102, 255, 0.3)'
            }}>
              浏览所有文章
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
