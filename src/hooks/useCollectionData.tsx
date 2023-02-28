import { useQuery } from '@tanstack/react-query';
import { getCollectionsByIds } from 'services/api';
import { ApiOptions } from 'types';
import { handleError } from 'utils/errors';
import { devLog } from 'utils/helpers';

export const useCollectionData = (
  collectionIds: string[],
  options: ApiOptions = {},
  queryKeyBase: string[] = [],
  queryKeyOverride?: string[],
) => {
  const queryKey = queryKeyOverride || [...queryKeyBase, 'collections', options];

  const { isLoading, isFetching, data } = useQuery({
    queryKey,
    queryFn: () => getCollectionsByIds(collectionIds, options),
    onSuccess: data => devLog(data),
    onError: handleError,
  });

  return {
    collections: data?.collections ?? [],
    total: data?.total ?? 0,
    isLoading: isLoading || isFetching,
  };
};
