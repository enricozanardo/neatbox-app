import { useEffect, useState } from 'react';
import { getCollectionsByIds } from 'services/api';
import { ApiOptions, Collection } from 'types';
import { devLog } from 'utils/helpers';

import useAccountData from './useAccountData';

export const useOwnedCollectionData = (
  options: ApiOptions = {},
  refresh?: boolean,
): { collections: Collection[]; isLoading: boolean; total: number } => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const { account } = useAccountData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!account?.storage.collectionsOwned) {
          return;
        }

        const data = await getCollectionsByIds(account.storage.collectionsOwned, {
          offset: options?.offset,
          limit: options?.limit,
          filters: options?.filters,
        });

        devLog(data);

        setCollections(data.collections);
        setTotal(data.total);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    fetchData();

    let interval: ReturnType<typeof setInterval>;

    if (refresh) {
      interval = setInterval(() => fetchData(), 10000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [account?.storage.collectionsOwned, options?.filters, options?.limit, options?.offset, refresh]);

  return { collections, total, isLoading };
};
