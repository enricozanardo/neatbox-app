import { AccountProps, Collection } from 'types';

export const generateDefaultAccount = (address: string): AccountProps => {
  const account: AccountProps = {
    filesOwned: [],
    filesAllowed: [],
    incomingFileRequests: [],
    outgoingFileRequests: [],
    collectionsOwned: [],
    collectionsAllowed: [],
    incomingCollectionRequests: [],
    outgoingCollectionRequests: [],
    username: '',
    email: '',
    address: Buffer.from(''),
    token: {
      balance: BigInt(0),
    },
  };

  return account;
};

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
