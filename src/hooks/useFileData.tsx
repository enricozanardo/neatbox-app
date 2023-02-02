import { useEffect, useState } from 'react';
import { getFilesByIds } from 'services/api';
import { ApiOptions, File } from 'types';

export const useFileData = (fileIds: string[], options: ApiOptions = {}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFilesByIds(fileIds, {
        offset: options?.offset,
        limit: options?.limit,
        filters: options?.filters,
      });

      setFiles(data.files);
      setTotal(data.total);
      setIsLoading(false);
    };

    try {
      fetchData();
    } catch (err) {
      setIsLoading(false);
    }
  }, [fileIds, options?.filters, options?.limit, options?.offset]);

  return { files, total, isLoading };
};
