import { useQuery } from '@tanstack/react-query';
import FileTable from 'components/ui/tables/FileTable';
import useTablePagination from 'hooks/useTablePagination';
import { getFilesByIds } from 'services/api';
import { devLog } from 'utils/helpers';

type Props = {
  fileIds: string[];
};

const FilesDisplay = ({ fileIds }: Props) => {
  const { offset, handlePageChange } = useTablePagination();

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
