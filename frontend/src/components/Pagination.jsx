"use client"

import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = []

  // Generate page numbers to display
  if (totalPages <= 5) {
    // If 5 or fewer pages, show all
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }
  } else {
    // Always show first page
    pageNumbers.push(1)

    // If current page is 1 or 2, show first 5 pages
    if (currentPage <= 3) {
      pageNumbers.push(2, 3, 4, 5)
    }
    // If current page is last or second last, show last 5 pages
    else if (currentPage >= totalPages - 2) {
      pageNumbers.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      // Remove duplicates
      const uniquePageNumbers = [...new Set(pageNumbers)]
      pageNumbers.length = 0
      pageNumbers.push(...uniquePageNumbers)
    }
    // Otherwise show current page and 2 pages before and after
    else {
      pageNumbers.push(currentPage - 1, currentPage, currentPage + 1)

      // Add ellipsis if needed
      if (currentPage > 3) {
        pageNumbers.splice(1, 0, "...")
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push("...", totalPages)
      }
    }
  }

  return (
    <div className="pagination">
      <button className="pagination-button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <FaChevronLeft />
      </button>

      {pageNumbers.map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="pagination-ellipsis">
            ...
          </span>
        ) : (
          <button
            key={page}
            className={`pagination-button ${currentPage === page ? "active" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ),
      )}

      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FaChevronRight />
      </button>
    </div>
  )
}

export default Pagination

