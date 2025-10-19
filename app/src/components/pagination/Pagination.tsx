export default function Pagination({
  currentPage,
  totalPages,
  nextPage,
  prevPage,
}: {
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
}) {
  return (
    <div className="flex justify-between items-center mt-6 px-6">
      <div className="flex gap-2 text-[#6E6E6E]">
        <span>
          Page {currentPage} of {totalPages}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          className="flex items-center align-center gap-2 px-3 py-1 rounded-md border border-primary text-primary disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => prevPage()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Previous
        </button>
        <button
          className="flex items-center align-center gap-2 px-3 py-1 rounded-md border border-primary text-primary disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => nextPage()}
        >
          Next
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
