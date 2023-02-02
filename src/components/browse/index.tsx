import config from 'config';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { getFiles } from 'services/api';
import { File, Filters } from 'types';

import FileTable from '../ui/tables/FileTable';
import SearchForm from './SearchForm';

const DEBOUNCE = 500;

const FILTERS_INIT = { searchInput: '', mimeType: '', sortType: '', isUpdated: false };

const Browse = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [filters, setFilters] = useState<Filters>(cloneDeep(FILTERS_INIT));
  const [initialized, setInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [filters]);

  /** search with debounce*/
  useEffect(() => {
    const fetchFiles = async () => {
      setIsLoading(true);

      const data = await getFiles({ offset, filters });

      setFiles(data.files);
      setTotal(data.total);
      setIsLoading(false);
    };

    if (!initialized) {
      fetchFiles();
      setInitialized(true);
      return;
    }

    const id = setTimeout(() => {
      fetchFiles();
    }, DEBOUNCE);

    return () => {
      clearTimeout(id);
    };
  }, [filters, offset, initialized]);

  const handlePageChange = (page: number) => {
    setIsLoading(true);

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
      <FileTable handlePageChange={handlePageChange} total={total} data={files} showLegend isLoading={isLoading} />
    </>
  );
};

export default Browse;
