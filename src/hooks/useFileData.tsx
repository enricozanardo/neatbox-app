import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cloneDeep } from 'lodash';
import { getFilesByIds } from 'services/api';
import { ApiOptions, Collection } from 'types';
import { handleError } from 'utils/errors';
import { devLog } from 'utils/helpers';

export const useFileData = (fileIds: string[], options: ApiOptions = {}, queryKeyBase: string[] = []) => {
  const queryClient = useQueryClient();
  const queryKey = [...queryKeyBase, 'files', fileIds, options];

  const { isLoading, isFetching, data } = useQuery({
    queryKey,
    queryFn: () => getFilesByIds(fileIds, options),
    onSuccess: data => devLog(data),
    onError: handleError,
    keepPreviousData: true,
  });

  const optimisticallyUpdateFileCollection = (fileIds: string[], collection: Collection) => {
    queryClient.setQueryData<Awaited<ReturnType<typeof getFilesByIds>>>(queryKey, prevData => {
      if (!prevData) {
        return prevData;
      }

      const updatedData = cloneDeep(prevData);

      /** Add collection id to files */
      fileIds
        .filter(fileId => !collection.fileIds.includes(fileId)) // filter out files already in collection
        .forEach(id => {
          const file = updatedData.files.find(f => f.data.id === id);

          if (file) {
            file.meta.collection.id = collection.id;
            file.meta.collection.title = collection.title;
          }
        });

      /** Remove collectionId from files not part of collection any more  */
      collection.fileIds
        .filter(id => !fileIds.includes(id))
        .forEach(id => {
          const file = updatedData.files.find(f => f.data.id === id);

          if (file) {
            file.meta.collection.id = '';
            file.meta.collection.title = '';
          }
        });

      return updatedData;
    });
  };

  return {
    files: data?.files ?? [],
    total: data?.total ?? 0,
    isLoading: isLoading || isFetching,
    optimisticallyUpdateFileCollection,
  };
};
