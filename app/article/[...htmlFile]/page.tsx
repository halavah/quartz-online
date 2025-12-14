import { notFound, redirect } from 'next/navigation';
import articlesData from '@/data/articles.json';

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

  // Decode URL-encoded path parts to handle Chinese characters
  const decodedPathParts = htmlFile.map(part => decodeURIComponent(part));

  // Reconstruct the htmlFile path from route params
  const htmlFilePath = `${decodedPathParts.join('/')}.html`;

  const article = articlesData.articles.find((a) => a.htmlFile === htmlFilePath);

  if (!article) {
    notFound();
  }

  // Redirect directly to the HTML file in public directory
  redirect(`/${htmlFilePath}`);
}