import { useQuery } from '@tanstack/react-query';
import { cloneDeep } from 'lodash';
import { useState } from 'react';

import FileTable from 'components/ui/tables/FileTable';
import useDebounce from 'hooks/useDebounce';
import useTablePagination from 'hooks/useTablePagination';
import { getFiles } from 'services/api';
import { Filters } from 'types';
import { handleError } from 'utils/errors';
import { devLog } from 'utils/helpers';

import SearchForm from './SearchForm';

const FILTERS_INIT = { searchInput: '', mimeType: '', sortType: '', isUpdated: false };

const Browse = () => {
  const [filters, setFilters] = useState<Filters>(cloneDeep(FILTERS_INIT));
  const debouncedFilters = useDebounce<Filters>(filters);
  const { offset, handlePageChange } = useTablePagination();

  const { isLoading, isFetching, data } = useQuery({
    queryKey: ['files', { offset, filters: debouncedFilters }],
    queryFn: () => getFiles({ offset, filters: debouncedFilters }),
    onSuccess: data => devLog(data),
    onError: handleError,
    keepPreviousData: true,
  });

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
