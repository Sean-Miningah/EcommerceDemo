import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "@/hooks/api/useProducts";

export function ProductPagination() {
  const { loading, totalCount, currentFilters, setFilters } = useProducts();
  const itemsPerPage = 12;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const currentPage = currentFilters?.page || 1;

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;

    setFilters({
      ...currentFilters,
      page
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  if (totalPages <= 1 || loading) {
    return null;
  }

  // Create an array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        startPage = 2;
        endPage = 4;
      }

      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
        endPage = totalPages - 1;
      }

      if (startPage > 2) {
        pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getPageNumbers().map((page, index) => (
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2">...</span>
        ) : (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(page as number)}
            className="w-8 h-8 p-0"
          >
            {page}
          </Button>
        )
      ))}

      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}