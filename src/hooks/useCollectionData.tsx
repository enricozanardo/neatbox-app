import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cloneDeep } from 'lodash';
import { getCollectionsByIds } from 'services/api';
import { ApiOptions, CreateCollectionAssetProps, UpdateCollectionAssetProps } from 'types';
import { handleError } from 'utils/errors';
import { devLog } from 'utils/helpers';
import { createDummyCollection } from 'utils/mocks';

export const useCollectionData = (collectionIds: string[], options: ApiOptions = {}, queryKeyBase: string[] = []) => {
  const queryClient = useQueryClient();
  const queryKey = [...queryKeyBase, 'collections', options];

  const { isLoading, isFetching, data } = useQuery({
    queryKey,
    queryFn: () => getCollectionsByIds(collectionIds, options),
    onSuccess: data => devLog(data),
    onError: handleError,
  });

  const optimisticallyAddCollection = (transactionId: string, address: Buffer, txAsset: CreateCollectionAssetProps) => {
    queryClient.setQueryData<Awaited<ReturnType<typeof getCollectionsByIds>>>(queryKey, prevData => {
      if (!prevData) {
        return prevData;
      }

      const newCollection = createDummyCollection(transactionId, address, txAsset);

      return {
        collections: [...prevData!.collections, newCollection],
        total: prevData.total + 1,
      };
    });
  };

  const optimisticallyUpdateCollection = (txAsset: UpdateCollectionAssetProps) => {
    queryClient.setQueryData<Awaited<ReturnType<typeof getCollectionsByIds>>>(queryKey, prevData => {
      if (!prevData) {
        return prevData;
      }

      const updatedData = cloneDeep(prevData);

      const collection = updatedData.collections.find(c => c.id === txAsset.collectionId);

      if (collection) {
        collection.fileIds = txAsset.fileIds;
        collection.transferFee = txAsset.transferFee;
      }

      return updatedData;
    });
  };

  return {
    collections: data?.collections ?? [],
    total: data?.total ?? 0,
    isLoading: isLoading || isFetching,
    optimisticallyAddCollection,
    optimisticallyUpdateCollection,
  };
};
