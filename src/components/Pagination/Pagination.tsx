import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  hasNextPage,
  hasPrevPage,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Course pagination" className="mt-4">
      <ul className="pagination justify-content-center">

        <li className={`page-item ${!hasPrevPage ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            aria-label="Previous"
          >
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>

        
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
          ) {
            return (
              <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                <button className="page-link" data-testid={`page-${pageNumber}`} onClick={() => onPageChange(pageNumber)}>
                  {pageNumber}
                </button>
              </li>
            );
          } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
            return (
              <li key={pageNumber} className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            );
          }
          return null;
        })}

        <li className={`page-item ${!hasNextPage ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
            aria-label="Next"
          >
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
      <div className="text-center text-muted mt-2">
        <small>
          Page {currentPage} of {totalPages} ({totalCount} total courses)
        </small>
      </div>
    </nav>
  );
};

export default Pagination;
