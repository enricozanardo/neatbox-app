import { useEffect, useState } from 'react';
import { getFilesByIds } from 'services/api';
import { useAccountStore } from 'stores/useAccountStore';
import { ApiOptions, File } from 'types';

export const useOwnedFilesData = (options: ApiOptions = {}): { files: File[]; isLoading: boolean } => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const account = useAccountStore(state => state.account);

  useEffect(() => {
    if (!account) {
      return;
    }

    const fetchData = async () => {
      const data = await getFilesByIds(account.storage.filesOwned, {
        offset: options?.offset,
        limit: options?.limit,
        filters: options?.filters,
      });
      setFiles(data.files);
    };

    try {
      fetchData();
    } catch (err) {
      setIsLoading(false);
    }
  }, [account, options?.filters, options?.limit, options?.offset]);

  return { files, isLoading };
};
