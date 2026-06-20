import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-4 mt-8 pb-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-full hover:bg-surface-container-high disabled:opacity-30 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      <span className="">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-full hover:bg-surface-container-high disabled:opacity-30 transition-colors"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
