import { QueryClient } from '@tanstack/react-query';
import { CustomField } from 'components/upload/CustomFields';
import { cloneDeep } from 'lodash';
import { getCollectionsByIds, getFilesByIds } from 'services/api';
import { AccountProps, Collection, File, UpdateCollectionAssetProps, UpdateFileAssetProps } from 'types';

import { jsonToBuffer } from './helpers';
import { createDummyCollection } from './mocks';

export const optimisticallyAddCollection = (
  queryClient: QueryClient,
  queryKey: string[],
  collectionId: string,
  address: Buffer,
  collectionData: { title: string; transferFee: number; fileIds: string[] },
) => {
  queryClient.setQueryData<Awaited<ReturnType<typeof getCollectionsByIds>>>(queryKey, prevData => {
    const prev = prevData || {
      collections: [],
      total: 0,
    };

    const newCollection = createDummyCollection(collectionId, address, collectionData);

    return {
      collections: [...prev.collections, newCollection],
      total: prev.total + 1,
    };
  });

  queryClient.setQueryData<AccountProps>(['account'], prevData => {
    if (!prevData) {
      return prevData;
    }

    const updatedData = cloneDeep(prevData);
    updatedData.storage.collectionsOwned.push(collectionId);

    return updatedData;
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

export const optimisticallyRemoveCollection = (queryClient: QueryClient, queryKey: string[], collectionId: string) => {
  queryClient.setQueryData<Awaited<ReturnType<typeof getCollectionsByIds>>>(queryKey, prevData => {
    const prev = prevData || {
      collections: [],
      total: 0,
    };

    return {
      collections: prev.collections.filter(col => col.id !== collectionId),
      total: prev.total + 1,
    };
  });

  queryClient.setQueryData<AccountProps>(['account'], prevData => {
    if (!prevData) {
      return prevData;
    }

    const updatedData = cloneDeep(prevData);
    updatedData.storage.collectionsOwned.push(collectionId);

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

export const removeRequests = (queryClient: QueryClient, ids: string[]) => {
  queryClient.setQueryData<AccountProps>(['account'], oldAccount => {
    if (!oldAccount) {
      return oldAccount;
    }

    const updatedAccount = { ...oldAccount };

    updatedAccount.storage.incomingFileRequests = updatedAccount.storage.incomingFileRequests.filter(
      r => !ids.includes(r.requestId),
    );
    updatedAccount.storage.outgoingFileRequests = updatedAccount.storage.outgoingFileRequests.filter(
      r => !ids.includes(r.requestId),
    );
    updatedAccount.storage.incomingCollectionRequests = updatedAccount.storage.incomingCollectionRequests.filter(
      r => !ids.includes(r.requestId),
    );
    updatedAccount.storage.outgoingCollectionRequests = updatedAccount.storage.outgoingCollectionRequests.filter(
      r => !ids.includes(r.requestId),
    );

    return updatedAccount;
  });
};

export const removeAccountCache = (queryClient: QueryClient) => {
  queryClient.removeQueries({ queryKey: ['account'], exact: true });
};
