'use client';

import { useEffect, useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const pages = [];
  // Mobile: show fewer pages
  const showPages = isMobile ? 3 : 5;

  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
  let endPage = Math.min(totalPages, startPage + showPages - 1);

  if (endPage - startPage + 1 < showPages) {
    startPage = Math.max(1, endPage - showPages + 1);
  }

  // 生成页码数组
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const buttonStyle = (isActive: boolean = false, isDisabled: boolean = false) => ({
    padding: isMobile ? '0.4rem 0.7rem' : '0.5rem 1rem',
    borderRadius: '0.5rem',
    transition: 'all 0.3s ease',
    background: isActive
      ? 'var(--primary-color)'
      : isDisabled
      ? 'rgba(255, 255, 255, 0.05)'
      : 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    color: isActive
      ? 'white'
      : isDisabled
      ? 'var(--text-secondary)'
      : 'var(--text-color)',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    fontSize: isMobile ? '0.8rem' : '0.875rem',
    minWidth: isMobile ? '32px' : '40px'
  });

  const navStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: isMobile ? '0.25rem' : '0.5rem',
    marginTop: '3rem',
    paddingBottom: '2rem',
    padding: isMobile ? '0 0.5rem' : '0'
  };

  const ellipsisStyle = {
    color: 'var(--text-secondary)',
    padding: isMobile ? '0 0.25rem' : '0 0.5rem',
    fontSize: isMobile ? '0.8rem' : '0.875rem',
    userSelect: 'none' as const
  };

  return (
    <nav style={navStyle}>
      {/* 上一页 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={buttonStyle(false, currentPage === 1)}
        onMouseEnter={(e) => {
          if (currentPage !== 1) {
            (e.target as HTMLElement).style.borderColor = 'var(--primary-color)';
            (e.target as HTMLElement).style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== 1) {
            (e.target as HTMLElement).style.borderColor = 'var(--border-color)';
            (e.target as HTMLElement).style.transform = 'translateY(0)';
          }
        }}
      >
        {isMobile ? '‹' : '上一页'}
      </button>

      {/* 第一页 */}
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            style={buttonStyle()}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.borderColor = 'var(--primary-color)';
              (e.target as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.borderColor = 'var(--border-color)';
              (e.target as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            1
          </button>
          {startPage > 2 && <span style={ellipsisStyle}>...</span>}
        </>
      )}

      {/* 页码 */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={buttonStyle(page === currentPage)}
          onMouseEnter={(e) => {
            if (page !== currentPage) {
              (e.target as HTMLElement).style.borderColor = 'var(--primary-color)';
              (e.target as HTMLElement).style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (page !== currentPage) {
              (e.target as HTMLElement).style.borderColor = 'var(--border-color)';
              (e.target as HTMLElement).style.transform = 'translateY(0)';
            }
          }}
        >
          {page}
        </button>
      ))}

      {/* 最后一页 */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span style={ellipsisStyle}>...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            style={buttonStyle()}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.borderColor = 'var(--primary-color)';
              (e.target as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.borderColor = 'var(--border-color)';
              (e.target as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* 下一页 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={buttonStyle(false, currentPage === totalPages)}
        onMouseEnter={(e) => {
          if (currentPage !== totalPages) {
            (e.target as HTMLElement).style.borderColor = 'var(--primary-color)';
            (e.target as HTMLElement).style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== totalPages) {
            (e.target as HTMLElement).style.borderColor = 'var(--border-color)';
            (e.target as HTMLElement).style.transform = 'translateY(0)';
          }
        }}
      >
        {isMobile ? '›' : '下一页'}
      </button>
    </nav>
  );
}