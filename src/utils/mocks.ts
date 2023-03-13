import { cryptography } from '@liskhq/lisk-client/browser';
import { AccountProps, Collection } from 'types';

export const generateDefaultAccount = (address: string): AccountProps => {
  const account: AccountProps = {
    address: cryptography.hexToBuffer(address),
    token: { balance: BigInt('0') },
    storage: {
      filesOwned: [],
      filesAllowed: [],
      incomingFileRequests: [],
      outgoingFileRequests: [],
      collectionsOwned: [],
      collectionsAllowed: [],
      incomingCollectionRequests: [],
      outgoingCollectionRequests: [],
      map: {
        username: '',
        emailHash: '',
      },
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
