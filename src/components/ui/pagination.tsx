import { Button } from "@/components/ui/button";
import { RefreshCcw, StepBack, StepForward } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  refreshData?: () => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  refreshData,
}: PaginationProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700">Show:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            onItemsPerPageChange(Number(e.target.value));
            onPageChange(1);
          }}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={200}>200</option>
          <option value={500}>500</option>
          <option value={1000}>1000</option>
          <option value={2000}>2000</option>
        </select>
        <span className="text-sm text-gray-700">entries</span>
      </div>

      <div className="flex flex-wrap gap-4 items-center space-x-2">
        <span className="text-sm text-gray-700">
          Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
          {totalItems} results
        </span>
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <StepBack className="text-primary" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (page) =>
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
            )
            .map((page, index, array) => (
              <div key={page} className="flex items-center">
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
                <Button
                  variant={currentPage === page ? "default" : "outlineLight"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </Button>
              </div>
            ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <StepForward className="text-primary" />
          </Button>
          {refreshData && (
            <Button
              onClick={() => {
                refreshData();
              }}
              variant="outlineLight"
              size="sm"
            >
              <RefreshCcw />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
