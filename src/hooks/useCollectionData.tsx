import { useQuery } from '@tanstack/react-query';
import { getCollectionsByIds } from 'services/api';
import { ApiOptions } from 'types';
import { handleError } from 'utils/errors';
import { devLog } from 'utils/helpers';

import useAccountData from './useAccountData';

export const useCollectionData = (
  collectionIds: string[],
  options: ApiOptions = {},
  queryKeyBase: string[] = [],
  queryKeyOverride?: string[],
  refetchInterval?: number,
) => {
  const { account } = useAccountData();

  const queryKey = queryKeyOverride || [...queryKeyBase, 'collections', options];

  const { isLoading, isFetching, data } = useQuery({
    queryKey,
    queryFn: () => getCollectionsByIds(collectionIds, options),
    onSuccess: data => devLog(data),
    onError: handleError,
    enabled: !!account,
    refetchInterval,
  });

  return {
    collections: data?.collections ?? [],
    total: data?.total ?? 0,
    isLoading: isLoading || isFetching,
  };
};
