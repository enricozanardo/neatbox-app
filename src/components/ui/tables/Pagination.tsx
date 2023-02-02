import range from 'lodash.range';
import { getClasses } from 'utils/helpers';

type Props = {
  total: number;
  currentPage: number;
  itemsPerPage: number;
  handleChange: (page: number) => void;
};

const Pagination = ({ total, currentPage, itemsPerPage, handleChange }: Props) => {
  const numOfPages = Math.ceil(total / itemsPerPage);

  const onPageClick = (page: number) => {
    handleChange(page);
  };

  const handleNextPageClick = () => {
    if (currentPage >= numOfPages) {
      return;
    }

    handleChange(currentPage + 1);
  };

  const handlePreviousPageClick = () => {
    if (currentPage <= 1) {
      return;
    }

    handleChange(currentPage - 1);
  };

  const getPages = () => {
    if (numOfPages <= 7) {
      return range(1, numOfPages + 1);
    }

    if (currentPage > 2 && numOfPages - currentPage + 1 > 2) {
      return [1, null, ...range(currentPage - 1, currentPage + 2), null, numOfPages];
    }

    return [...range(1, 4), null, ...range(numOfPages - 2, numOfPages + 1)];
  };

  const renderButton = (page: number | null, index: number) => {
    const key = `button-${page}-${index}`;

    if (typeof page !== 'number') {
      return (
        <span key={key} className="pagination">
          ...
        </span>
      );
    }

    const isCurrentPage = currentPage === page;

    return (
      <button
        key={key}
        aria-current={isCurrentPage ? 'page' : undefined}
        onClick={() => onPageClick(page)}
        className={getClasses(isCurrentPage ? 'pagination-selected' : 'pagination')}
      >
        {page}
      </button>
    );
  };

  return (
    <div className="py-8 flex items-center justify-between">
      <div className="flex-1 flex items-center justify-center">
        <div>
          <nav className="relative z-0 inline-flex rounded-md -space-x-px gap-2 md:gap-4" aria-label="Pagination">
            <button className="pagination" onClick={handlePreviousPageClick}>
              <span className="sr-only">Previous</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {getPages().map((page, index) => renderButton(page, index))}

            <button className="pagination" onClick={handleNextPageClick}>
              <span className="sr-only">Next</span>

              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
