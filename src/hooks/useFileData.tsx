import { useQuery } from '@tanstack/react-query';
import { getFilesByIds } from 'services/api';
import { ApiOptions } from 'types';
import { handleError } from 'utils/errors';
import { devLog } from 'utils/helpers';

export const useFileData = (fileIds: string[], options: ApiOptions = {}, queryKeyBase: string[] = []) => {
  const { isLoading, isFetching, data } = useQuery({
    queryKey: [...queryKeyBase, 'files', fileIds, options],
    queryFn: () => getFilesByIds(fileIds, options),
    onSuccess: data => devLog(data),
    onError: handleError,
    keepPreviousData: true,
  });

  return { files: data?.files ?? [], total: data?.total ?? 0, isLoading: isLoading || isFetching };
};
