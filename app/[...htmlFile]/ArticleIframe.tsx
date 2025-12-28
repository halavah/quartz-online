'use client';

import { useState, useEffect, useRef } from 'react';

interface ArticleIframeProps {
  htmlFilePath: string;
  title: string;
}

export default function ArticleIframe({ htmlFilePath, title }: ArticleIframeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Set a timeout to force stop loading if it takes too long
    // 减少到3秒，因为已经有HTML预加载优化
    loadTimeoutRef.current = setTimeout(() => {
      if (isLoading) {
        console.warn('Iframe load timeout, forcing display');
        setIsLoading(false);
      }
    }, 3000); // 3 seconds timeout (优化后从5s减少到3s)

    const handleLoad = () => {
      console.log('Iframe loaded successfully');
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = () => {
      console.error('Iframe failed to load');
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      setIsLoading(false);
      setHasError(true);
    };

    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
    };
  }, [isLoading]);

  if (hasError) {
    return (
      <div className="w-full text-center py-32">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-light mb-2" style={{ color: 'var(--text-color)' }}>
          加载失败
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          无法加载文章内容: {htmlFilePath}
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '1.5rem',
            padding: '0.75rem 1.5rem',
            background: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 500
          }}
        >
          重新加载
        </button>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className="w-full text-center py-32">
          <div className="inline-block w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <h2 className="text-2xl font-light mb-2" style={{ color: 'var(--text-color)' }}>
            加载中...
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            正在加载文章内容
          </p>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={`/${htmlFilePath}`}
        loading="eager"
        style={{
          width: '100%',
          height: 'calc(100vh - 60px)',
          border: 'none',
          display: isLoading ? 'none' : 'block',
          background: 'var(--dark-bg)'
        }}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"
        title={title}
      />
    </>
  );
}
