import React from 'react';
import articlesData from '@/data/articles.json';

export default function Footer() {
  const { beianNumber, copyrightText } = articlesData.config;

  return (
    <footer className="border-t border-gray-800 bg-black/50 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          {/* 版权信息 */}
          <div className="text-sm text-gray-400">
            {copyrightText}
          </div>

          {/* 备案号 */}
          {beianNumber && (
            <div className="text-sm text-gray-500">
              {beianNumber}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
