import React from 'react';
import articlesData from '@/data/articles.json';

export default function Footer() {
  const { beianNumber, copyrightText } = articlesData.config;

  return (
    <footer className="border-t backdrop-blur-sm mt-20" style={{
      borderColor: 'var(--border-color)',
      background: 'var(--card-bg)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          {/* 版权信息 */}
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {copyrightText}
          </div>

          {/* 备案号 */}
          {beianNumber && (
            <div className="text-sm" style={{ color: 'var(--text-secondary)', opacity: 0.8 }}>
              {beianNumber}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
