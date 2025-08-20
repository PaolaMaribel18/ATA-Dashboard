import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 text-sm text-gray-600">
      <span>
        Mostrando {(currentPage - 1) * 10 + 1} – {Math.min(currentPage * 10, totalPages * 10)} de {totalPages * 10}
      </span>
      <div className="flex gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="p-2 rounded border disabled:opacity-30"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="p-2 rounded border disabled:opacity-30"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
