// _components/Pagination.tsx

type PaginationProps = {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  };
  
  export const Pagination = ({ currentPage, totalItems, pageSize, onPageChange }: PaginationProps) => {
    const totalPages = Math.ceil(totalItems / pageSize);
  
    const handlePrevClick = () => {
      if (currentPage > 1) onPageChange(currentPage - 1);
    };
  
    const handleNextClick = () => {
      if (currentPage < totalPages) onPageChange(currentPage + 1);
    };
  
  
    return (
      <div className="flex items-center justify-center space-x-2 mt-4 ">
        <button
          onClick={handlePrevClick}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        
        <p className="text-base mx-20 font-mono">Page {currentPage} <span className="text-teal-500">out of {totalPages}</span></p>
  
        <button
          onClick={handleNextClick}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };
  