import { notFound } from 'next/navigation';
import Link from 'next/link';
import articlesData from '@/data/articles.json';
import ArticleIframe from './ArticleIframe';

export function generateStaticParams() {
  const params = articlesData.articles.map((article) => {
    // Convert htmlFile path to route params array
    // Remove .html extension and split by /
    const htmlPath = article.htmlFile.replace('.html', '');
    const pathParts = htmlPath.split('/');

    return {
      htmlFile: pathParts
    };
  });

  return params;
}

export default async function ArticlePage({ params }: { params: Promise<{ htmlFile: string[] }> }) {
  const { htmlFile } = await params;
  const { config } = articlesData;

  // Decode URL-encoded path parts to handle Chinese characters
  const decodedPathParts = htmlFile.map(part => decodeURIComponent(part));

  // Reconstruct the htmlFile path from route params
  const htmlFilePath = `${decodedPathParts.join('/')}.html`;

  const article = articlesData.articles.find((a) => a.htmlFile === htmlFilePath);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--dark-bg)' }}>
      {/* Header with back navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg" style={{
        background: 'rgba(10, 14, 39, 0.8)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="w-full px-6 py-4 flex items-center justify-between">
          {/* Left: Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 hover:gap-4 transition-all"
            style={{
              color: 'var(--text-secondary)',
              fontWeight: 500,
              textDecoration: 'none'
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>返回首页</span>
          </Link>

          {/* Right: Ad space */}
          <div className="flex-1 flex items-center justify-end">
            <a
              href="https://api.nekoapi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 transition-opacity hover:opacity-80"
              style={{
                textDecoration: 'none'
              }}
            >
              {/* API Icon */}
              <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>

              <span style={{
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                fontWeight: 500
              }}>
                API中转站
              </span>

              <span style={{
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                opacity: 0.8
              }}>
                260+AI大模型
              </span>

              <span style={{
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                opacity: 0.8
              }}>
                0.95一刀
              </span>

              <span style={{
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 600,
                padding: '0.375rem 0.875rem',
                background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)',
                borderRadius: '0.375rem',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)'
              }}>
                立即进入
              </span>
            </a>
          </div>
        </div>
      </header>

      {/* Article content */}
      <main style={{ position: 'relative', marginTop: '60px' }}>
        {article.htmlFile ? (
          <ArticleIframe htmlFilePath={article.htmlFile} title={article.title} />
        ) : (
          <div className="w-full text-center py-32">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-3xl font-light mb-4" style={{ color: 'var(--text-color)' }}>
              文章内容正在准备中
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              该文章的详细内容即将发布，敬请期待
            </p>
          </div>
        )}
      </main>
    </div>
  );
}