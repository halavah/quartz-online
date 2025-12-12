import { notFound } from 'next/navigation';
import Link from 'next/link';
import articlesData from '@/data/articles.json';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function generateStaticParams() {
  return articlesData.articles.map((article) => {
    // Convert htmlFile path to route params array
    const htmlPath = article.htmlFile.replace('.html', '');
    return {
      htmlFile: htmlPath.split('/')
    };
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ htmlFile: string[] }> }) {
  const { htmlFile } = await params;

  // Reconstruct the htmlFile path from route params
  const htmlFilePath = `${htmlFile.join('/')}.html`;

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
    <div className="min-h-screen">
      {/* Header with back navigation - 简单的顶部导航 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="w-full px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>返回</span>
          </Link>
        </div>
      </header>

      {/* Article content - 完全由 HTML 控制，无限制宽度 */}
      <main className="w-full">
        {htmlContent ? (
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        ) : (
          <div className="w-full text-center py-32">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-3xl font-light text-gray-900 mb-4">文章内容正在准备中</h2>
            <p className="text-gray-600">该文章的详细内容即将发布，敬请期待</p>
          </div>
        )}
      </main>
    </div>
  );
}