import {
  CancelRequestAssetProps,
  CreateCollectionAssetProps,
  CreateFileAssetProps,
  RequestCollectionOwnershipAssetProps,
  RequestCollectionTransferAssetProps,
  RequestFileAccessPermissionAssetProps,
  RequestFileOwnershipAssetProps,
  RequestFileTransferAssetProps,
  RespondToCollectionRequestAssetProps,
  RespondToFileRequestAssetProps,
  TimedTransferAssetProps,
  UpdateCollectionAssetProps,
  UpdateFileAssetProps,
} from 'types';

import * as api from './api';
import { cryptography } from '@liskhq/lisk-client/browser';
import config from 'config';
import { bufferToHex } from 'utils/crypto';

export const TX_FEES = {
  create: BigInt('10000000000'),
  timedTransfer: BigInt('2500000000'),
  createCollection: BigInt('5000000000'),
  base: BigInt('500000'),
};

const getPrivateKey = async (passphrase: string) => {
  const privateKey = await cryptography.ed.getPrivateKeyFromPhraseAndPath(passphrase, config.DERIVATION_PATH);
  return bufferToHex(privateKey);
};

export const sendCreateFileAsset = async (passphrase: string, params: CreateFileAssetProps) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      module: 'storage',
      command: 'createFile',
      fee: TX_FEES.create,
      params,
    },
    await getPrivateKey(passphrase),
  );

  return client.transaction.send(tx);
};

export const sendRequestFileOwnershipAsset = async (passphrase: string, params: RequestFileOwnershipAssetProps) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      module: 'storage',
      command: 'requestFileOwnership',
      fee: TX_FEES.base,
      params,
    },
    await getPrivateKey(passphrase),
  );

  return client.transaction.send(tx);
};

export const sendRequestFileAccessPermissionAsset = async (
  passphrase: string,
  params: RequestFileAccessPermissionAssetProps,
) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      module: 'storage',
      command: 'requestFilePermission',
      fee: TX_FEES.base,
      params,
    },
    await getPrivateKey(passphrase),
  );

  return client.transaction.send(tx);
};

export const sendRequestFileTransferAsset = async (passphrase: string, params: RequestFileTransferAssetProps) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      module: 'storage',
      command: 'requestFileTransfer',
      fee: TX_FEES.base,
      params,
    },
    await getPrivateKey(passphrase),
  );

  return client.transaction.send(tx);
};

export const sendRespondToFileRequestAsset = async (passphrase: string, params: RespondToFileRequestAssetProps) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      module: 'storage',
      command: 'respondToFileRequest',
      fee: TX_FEES.base,
      params,
    },
    await getPrivateKey(passphrase),
  );

  return client.transaction.send(tx);
};

export const sendUpdateFileAsset = async (passphrase: string, params: UpdateFileAssetProps) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      module: 'storage',
      command: 'updateFile',
      fee: TX_FEES.base,
      params,
    },
    await getPrivateKey(passphrase),
  );

  return client.transaction.send(tx);
};

export const sendTimedTransferAsset = async (passphrase: string, params: TimedTransferAssetProps) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      module: 'storage',
      command: 'timedTransfer',
      fee: TX_FEES.timedTransfer,
      params,
    },
    await getPrivateKey(passphrase),
  );

  return client.transaction.send(tx);
};

export const sendCreateCollectionAsset = async (passphrase: string, params: CreateCollectionAssetProps) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      module: 'storage',
      command: 'createCollection',
      fee: TX_FEES.createCollection,
      params,
    },
    await getPrivateKey(passphrase),
  );

  return client.transaction.send(tx);
};

export const sendUpdateCollectionAsset = async (passphrase: string, params: UpdateCollectionAssetProps) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      module: 'storage',
      command: 'updateCollection',
      fee: BigInt(10000000),
      params,
    },
    await getPrivateKey(passphrase),
  );

  return client.transaction.send(tx);
};

export const sendRequestCollectionOwnershipAsset = async (
  passphrase: string,
  params: RequestCollectionOwnershipAssetProps,
) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      module: 'storage',
      command: 'requestCollectionOwnership',
      fee: BigInt(10000000),
      params,
    },
    await getPrivateKey(passphrase),
  );

  return client.transaction.send(tx);
};

export const sendRequestCollectionTransferAsset = async (
  passphrase: string,
  params: RequestCollectionTransferAssetProps,
) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      module: 'storage',
      command: 'requestCollectionTransfer',
      fee: BigInt(10000000),
      params,
    },
    await getPrivateKey(passphrase),
  );

  return client.transaction.send(tx);
};

export const sendRespondToCollectionRequestAsset = async (
  passphrase: string,
  params: RespondToCollectionRequestAssetProps,
) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      module: 'storage',
      command: 'respondToCollectionRequest',
      fee: BigInt(10000000),
      params,
    },
    await getPrivateKey(passphrase),
  );

  return client.transaction.send(tx);
};

export const sendCancelRequestAsset = async (passphrase: string, params: CancelRequestAssetProps) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      module: 'storage',
      command: 'cancelRequest',
      fee: TX_FEES.base,
      params,
    },
    await getPrivateKey(passphrase),
  );

  return client.transaction.send(tx);
};
