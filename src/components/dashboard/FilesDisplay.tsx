import { useQuery } from '@tanstack/react-query';
import FileTable from 'components/ui/tables/FileTable';
import config from 'config';
import { useState } from 'react';
import { getFilesByIds } from 'services/api';
import { devLog } from 'utils/helpers';

type Props = {
  fileIds: string[];
};

const FilesDisplay = ({ fileIds }: Props) => {
  const [offset, setOffset] = useState(0);

  const { isLoading, isFetching, data } = useQuery({
    queryKey: ['files', fileIds, [offset]],
    queryFn: () => getFilesByIds(fileIds, { offset }),
    onSuccess: data => devLog(data),
    onError: err => {
      // @ts-ignore
      toast.error(err.message);
    },
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
    <FileTable
      handlePageChange={handlePageChange}
      total={data?.total ?? 0}
      data={data?.files ?? []}
      isLoading={isLoading || isFetching}
    />
  );
};

export default FilesDisplay;
