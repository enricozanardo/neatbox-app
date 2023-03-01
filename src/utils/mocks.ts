import { Collection } from 'types';

export const createDummyCollection = (
  id: string,
  owner: Buffer,
  collectionData: { title: string; transferFee: number; fileIds: string[] },
): Collection => {
  const { title, transferFee, fileIds } = collectionData;

  return {
    id,
    title,
    transferFee,
    owner,
    fileIds,
    requests: [],
  };
};
