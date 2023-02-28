import { Collection, CreateCollectionAssetProps } from 'types';

export const createDummyCollection = (id: string, owner: Buffer, txAsset: CreateCollectionAssetProps): Collection => {
  const { title, transferFee } = txAsset;

  return {
    id,
    title,
    transferFee,
    owner,
    fileIds: [],
    requests: [],
  };
};
