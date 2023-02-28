import { QueryClient } from '@tanstack/react-query';
import { CustomField } from 'components/upload/CustomFields';
import { cloneDeep } from 'lodash';
import { getCollectionsByIds, getFilesByIds } from 'services/api';
import { Collection, CreateCollectionAssetProps, File, UpdateCollectionAssetProps, UpdateFileAssetProps } from 'types';

import { jsonToBuffer } from './helpers';
import { createDummyCollection } from './mocks';

export const optimisticallyAddCollection = (
  queryClient: QueryClient,
  queryKey: string[],
  transactionId: string,
  address: Buffer,
  txAsset: CreateCollectionAssetProps,
) => {
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

export const optimisticallyUpdateCollection = (
  queryClient: QueryClient,
  queryKey: string[],
  txAsset: UpdateCollectionAssetProps,
) => {
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

export const optimisticallyUpdateFileCollection = (
  queryClient: QueryClient,
  queryKey: string[],
  fileIds: string[],
  collection: Collection,
) => {
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

export const optimisticallyUpdateFile = (
  queryClient: QueryClient,
  asset: UpdateFileAssetProps,
  isPrivate: boolean,
  customFields: CustomField[],
) => {
  const { fileId, accessPermissionFee, transferFee } = asset;

  queryClient.setQueryData<File>(['view', fileId], oldFile => {
    if (!oldFile) {
      return oldFile;
    }

    return {
      ...oldFile,
      data: {
        ...oldFile.data,
        accessPermissionFee,
        transferFee,
        private: isPrivate,
        customFields: jsonToBuffer(customFields),
      },
    };
  });
};
