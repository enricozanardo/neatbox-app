import FileTable from 'components/ui/tables/FileTable';
import config from 'config';
import { useFileData } from 'hooks/useFileData';
import { useState } from 'react';

type Props = {
  fileIds: string[];
};

const DashboardFileTable = ({ fileIds }: Props) => {
  const [offset, setOffset] = useState(0);
  const { files, total, isLoading } = useFileData(fileIds, { offset });

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

  return <FileTable handlePageChange={handlePageChange} total={total} data={files} isLoading={isLoading} />;
};

export default DashboardFileTable;
