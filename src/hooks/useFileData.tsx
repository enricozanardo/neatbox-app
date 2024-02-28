import { useQuery } from '@tanstack/react-query';

import { getFilesByIds } from 'services/api';
import { ApiOptions } from 'types';
import { handleError } from 'utils/errors';
import { devLog } from 'utils/helpers';

export const useFileData = (
  fileIds: string[],
  options: ApiOptions = {},
  queryKeyBase: string[] = [],
  queryKeyOverride?: string[],
  refetchInterval?: number,
) => {
  const queryKey = queryKeyOverride || [...queryKeyBase, 'files', fileIds, options];

  const { isLoading, isFetching, data } = useQuery({
    queryKey,
    queryFn: () => getFilesByIds(fileIds, options),
    onSuccess: data => devLog(data),
    onError: handleError,
    keepPreviousData: true,
    refetchInterval,
  });

  return {
    files: data?.files ?? [],
    total: data?.total ?? 0,
    isLoading: isLoading || isFetching,
  };
};
