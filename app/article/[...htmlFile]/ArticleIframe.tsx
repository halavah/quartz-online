'use client';

import { useState, useEffect, useRef } from 'react';

interface ArticleIframeProps {
  htmlFilePath: string;
  title: string;
}

export default function ArticleIframe({ htmlFilePath, title }: ArticleIframeProps) {
  const [htmlContent, setHtmlContent] = useState('');
  const [iframeHeight, setIframeHeight] = useState('100vh');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Load HTML content
    async function loadHTML() {
      try {
        const response = await fetch(`/${htmlFilePath}`);
        if (!response.ok) {
          throw new Error(`Failed to load HTML: ${response.statusText}`);
        }
        const html = await response.text();
        setHtmlContent(html);
        setIsLoading(false);
      } catch (err) {
        console.error(`Failed to load HTML file: ${htmlFilePath}`, err);
        setError('Failed to load article content');
        setIsLoading(false);
      }
    }

    loadHTML();
  }, [htmlFilePath]);

  // Auto-adjust iframe height
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !htmlContent) return;

    const adjustHeight = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          const height = iframeDoc.documentElement.scrollHeight;
          setIframeHeight(`${height}px`);
        }
      } catch (error) {
        console.error('Cannot access iframe content:', error);
      }
    };

    const handleLoad = () => {
      adjustHeight();

      // Watch for content changes (e.g., animations, dynamic content)
      const iframeDoc = iframe.contentDocument;
      if (iframeDoc) {
        const mutationObserver = new MutationObserver(adjustHeight);
        mutationObserver.observe(iframeDoc.body, {
          childList: true,
          subtree: true,
          attributes: true
        });

        // Also adjust on window resize
        const resizeObserver = new ResizeObserver(adjustHeight);
        resizeObserver.observe(iframeDoc.body);

        // Cleanup function
        return () => {
          mutationObserver.disconnect();
          resizeObserver.disconnect();
        };
      }
    };

    // Adjust height after iframe loads
    iframe.addEventListener('load', handleLoad);

    // Initial adjustment after a short delay
    const timeout = setTimeout(adjustHeight, 100);

    return () => {
      iframe.removeEventListener('load', handleLoad);
      clearTimeout(timeout);
    };
  }, [htmlContent]);

  if (isLoading) {
    return (
      <div className="w-full text-center py-32">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-3xl font-light mb-4" style={{ color: 'var(--text-color)' }}>
          加载中...
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          正在加载��章内容
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-32">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-3xl font-light mb-4" style={{ color: 'var(--text-color)' }}>
          加载失败
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          {error}
        </p>
      </div>
    );
  }

  if (!htmlContent) {
    return (
      <div className="w-full text-center py-32">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-3xl font-light mb-4" style={{ color: 'var(--text-color)' }}>
          文章内容正在准备中
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          该文章的详细内容即将发布，敬请期待
        </p>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      srcDoc={htmlContent}
      style={{
        width: '100%',
        height: iframeHeight,
        border: 'none',
        display: 'block',
        overflow: 'hidden'
      }}
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      title={title}
    />
  );
}
