import FileTable from 'components/ui/tables/FileTable';
import { useFileData } from 'hooks/useFileData';
import useTablePagination from 'hooks/useTablePagination';

type Props = {
  fileIds: string[];
};

const FilesDisplay = ({ fileIds }: Props) => {
  const { offset, handlePageChange } = useTablePagination();
  const { files, total, isLoading } = useFileData(fileIds, { offset });

  return <FileTable handlePageChange={handlePageChange} total={total} data={files} isLoading={isLoading} />;
};

export default FilesDisplay;
