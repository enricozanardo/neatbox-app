import { useQuery } from '@tanstack/react-query';
import config from 'config';
import useDebounce from 'hooks/useDebounce';
import { cloneDeep } from 'lodash';
import { useState } from 'react';
import { getFiles } from 'services/api';
import { Filters } from 'types';
import { handleError } from 'utils/errors';
import { devLog } from 'utils/helpers';

import FileTable from '../ui/tables/FileTable';
import SearchForm from './SearchForm';

const FILTERS_INIT = { searchInput: '', mimeType: '', sortType: '', isUpdated: false };

const Browse = () => {
  const [offset, setOffset] = useState(0);
  const [filters, setFilters] = useState<Filters>(cloneDeep(FILTERS_INIT));
  const debouncedFilters = useDebounce<Filters>(filters);

  const { isLoading, isFetching, data } = useQuery({
    queryKey: ['files', { offset, filters: debouncedFilters }],
    queryFn: () => getFiles({ offset, filters: debouncedFilters }),
    onSuccess: data => devLog(data),
    onError: handleError,
    keepPreviousData: true,
  });

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

  return (
    <>
      <SearchForm filters={filters} setFilters={setFilters} />
      <FileTable
        handlePageChange={handlePageChange}
        total={data?.total ?? 0}
        data={data?.files ?? []}
        showLegend
        isLoading={isLoading || isFetching}
      />
    </>
  );
};

export default Browse;
