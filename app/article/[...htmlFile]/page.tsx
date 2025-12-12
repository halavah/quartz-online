import { notFound } from 'next/navigation';
import Link from 'next/link';
import articlesData from '@/data/articles.json';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function generateStaticParams() {
  const params = articlesData.articles.map((article) => {
    // Convert htmlFile path to route params array
    // Remove .html extension and split by /
    const htmlPath = article.htmlFile.replace('.html', '');
    const pathParts = htmlPath.split('/');

    return {
      htmlFile: pathParts
    };
  });

  // Debug log
  console.log('Generated static params:', params);

  return params;
}

export default async function ArticlePage({ params }: { params: Promise<{ htmlFile: string[] }> }) {
  const { htmlFile } = await params;

  // Decode URL-encoded path parts to handle Chinese characters
  const decodedPathParts = htmlFile.map(part => decodeURIComponent(part));

  // Reconstruct the htmlFile path from route params
  const htmlFilePath = `${decodedPathParts.join('/')}.html`;

  const article = articlesData.articles.find((a) => a.htmlFile === htmlFilePath);

  if (!article) {
    notFound();
  }

  // Load external HTML file if it exists
  let htmlContent = '';
  if (article.htmlFile) {
    try {
      const htmlPath = join(process.cwd(), 'public', article.htmlFile);
      htmlContent = await readFile(htmlPath, 'utf-8');
    } catch (error) {
      console.error(`Failed to load HTML file: ${article.htmlFile}`, error);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--dark-bg)' }}>
      {/* Header with back navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-lg" style={{
        background: 'rgba(10, 14, 39, 0.8)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="w-full px-8 py-4 max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 hover:gap-4 transition-all" style={{
              color: 'var(--text-secondary)',
              fontWeight: 500
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>返回 TechHub</span>
          </Link>
        </div>
      </header>

      {/* Article content */}
      <main style={{ position: 'relative' }}>
        {htmlContent ? (
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
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