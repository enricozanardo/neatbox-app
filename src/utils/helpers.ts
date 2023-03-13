import { Buffer } from 'buffer';
import { DateTime } from 'luxon';
import { AccountProps, Collection, CollectionRequest, File, FileRequest } from 'types';

import { beddowsToLsk } from './formatting';

export const getClasses = (...classes: (string | undefined)[]) => {
  return classes.filter(c => c !== undefined).join(' ');
};

export const jsonToBuffer = (input: any) => {
  const stringifiedJSON = JSON.stringify(input);
  return Buffer.from(stringifiedJSON);
};

export const bufferToJson = (input: Buffer) => {
  let buffer!: Buffer;

  if (!Buffer.isBuffer(input)) {
    buffer = Buffer.from(input);
  } else {
    buffer = input;
  }

  return JSON.parse(buffer.toString());
};

export const fileIsTimedTransfer = (file: File) => {
  return file.meta.expiration.unix > 0;
};

export const fileIsPArtOfCollection = (file: File) => {
  return !!file.meta.collection.id;
};

export const accountHasEnoughBalance = (required: number, account: AccountProps | undefined | null) => {
  if (!account) {
    throw Error('No Account supplied');
  }

  const minRemainingBalance = 0.05;
  const totalRequired = required + minRemainingBalance;
  const accountBalance = Number(beddowsToLsk(account.token.balance));

  return accountBalance >= totalRequired;
};

export const isEmail = (input: unknown) => {
  if (typeof input !== 'string') {
    return false;
  }

  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return regex.test(input);
};

export const devLog = (input: any) => {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  console.debug(input);
};

export const removeDuplicates = (arr: string[]) => {
  return arr.filter((item, index) => arr.indexOf(item) === index);
};

export const prepareFileRequests = (
  files: File[],
  requests: {
    fileId: string;
    requestId: string;
  }[],
) => {
  const data: { request: FileRequest; file: File }[] = [];

  requests.forEach(req => {
    const file = files.find(f => f.data.id === req.fileId);
    const request = file?.data.requests.find(r => r.requestId === req.requestId);

    if (!file || !request) {
      return;
    }

    data.push({ request, file });
  });

  return data;
};

export const prepareCollectionRequests = (
  collections: Collection[],
  requests: {
    collectionId: string;
    requestId: string;
  }[],
) => {
  const data: { request: CollectionRequest; collection: Collection }[] = [];

  requests.forEach(req => {
    const collection = collections.find(c => c.id === req.collectionId);
    const request = collection?.requests.find(r => r.requestId === req.requestId);

    if (!collection || !request) {
      return;
    }

    data.push({ request, collection });
  });

  return data;
};

export const getTransactionTimestamp = () => {
  return DateTime.now().toUTC().toUnixInteger() - 10;
};
