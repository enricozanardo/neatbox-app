import config from 'config';
import { useState } from 'react';

const useTablePagination = () => {
  const [offset, setOffset] = useState(0);

  const handlePageChange = (page: number) => {
    let newOffset = 0;

    if (page > 1) {
      newOffset = (page - 1) * config.ITEMS_PER_PAGE;
    }

    if (newOffset === offset) {
      return;
    }

    setOffset(newOffset);
  };

  return { offset, handlePageChange };
};

export default useTablePagination;
