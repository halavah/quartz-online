'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = [];
  const showPages = 5; // 显示的页码数量

  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
  let endPage = Math.min(totalPages, startPage + showPages - 1);

  if (endPage - startPage + 1 < showPages) {
    startPage = Math.max(1, endPage - showPages + 1);
  }

  // 生成页码数组
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex justify-center items-center gap-2 mt-12 pb-8">
      {/* 上一页 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg transition-colors ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
        }`}
      >
        上一页
      </button>

      {/* 第一页 */}
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
          >
            1
          </button>
          {startPage > 2 && <span className="px-2 text-gray-400">...</span>}
        </>
      )}

      {/* 页码 */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
          }`}
        >
          {page}
        </button>
      ))}

      {/* 最后一页 */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* 下一页 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-lg transition-colors ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
        }`}
      >
        下一页
      </button>
    </nav>
  );
}