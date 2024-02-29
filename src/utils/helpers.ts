import { cryptography } from '@liskhq/lisk-client/browser';
import { Buffer } from 'buffer';
import { DateTime } from 'luxon';

import { Collection, CollectionRequest, NeatboxFile, FileRequest, JsonBuffer } from 'types';

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

export const isSameAddress = (a: Buffer, lsk32address?: string) => {
  if (!lsk32address) {
    return false;
  }

  const address = cryptography.address.getAddressFromLisk32Address(lsk32address);

  return Buffer.compare(a, address) === 0;
};

export const fileIsTimedTransfer = (file: NeatboxFile) => {
  return file.meta.expiration.unix > 0;
};

export const fileIsPArtOfCollection = (file: NeatboxFile) => {
  return !!file.meta.collection.id;
};

export const accountHasEnoughBalance = (required: number, balance: string | BigInt | undefined) => {
  if (!balance) {
    throw Error('No balance supplied');
  }

  const minRemainingBalance = 0.05;
  const totalRequired = required + minRemainingBalance;
  const accountBalance = Number(beddowsToLsk(balance));

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

export const isDev = process.env.NODE_ENV === 'development';

export const devLog = (input: any) => {
  if (!isDev) {
    return;
  }

  console.debug(input);
};

export const removeDuplicates = (arr: string[]) => {
  return arr.filter((item, index) => arr.indexOf(item) === index);
};

export const prepareFileRequests = (
  files: NeatboxFile[],
  requests: {
    fileId: string;
    requestId: string;
  }[],
) => {
  const data: { request: FileRequest; file: NeatboxFile }[] = [];

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

/**
 * Ridiculous mandatory helper function to circumvent silly behavior from Lisk SDK
 */
export const cleanupMessySDKResponse = <T>(value: T) => {
  if (value === null || value === '{}') {
    return null;
  }

  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return null;
  }

  return value;
};

export const isJsonBuffer = (input: any) => {
  return input && typeof input === 'object' && input.constructor === Object && input.type === 'Buffer';
};

export const convertJsonBufferToRegularBuffer = (input: JsonBuffer) => {
  const buff = Buffer.from(input.data);
  return buff;
};

export const replaceBuffersRecursively = (obj: any) => {
  const errors: any[] = [];

  for (let key in obj) {
    if (typeof obj[key] === 'object' && !isJsonBuffer(obj[key])) {
      if (Array.isArray(obj[key])) {
        for (let i = 0; i < obj[key].length; i++) {
          replaceBuffersRecursively(obj[key][i]);
        }
      } else {
        if (typeof obj[key] !== 'string') {
          replaceBuffersRecursively(obj[key]);
        }
      }
    } else {
      try {
        obj[key] = isJsonBuffer(obj[key]) ? convertJsonBufferToRegularBuffer(obj[key]) : obj[key];
      } catch (err) {
        // Todo: resolve (non-harmful) error
        errors.push(errors);
      }
    }
  }

  if (errors.length > 0) {
    console.log('Errors while iterating over object: ', { errors });
  }

  return obj;
};

/**
 * Replaces JSON buffers with regular buffers
 */
export const sanitizeBuffers = <T>(input: T): T => {
  if (typeof input !== 'object' || input === null) {
    return input;
  }

  const output = replaceBuffersRecursively(input);

  return output;
};
