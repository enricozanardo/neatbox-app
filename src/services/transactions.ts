import {
  CancelRequestAssetProps,
  CreateCollectionAssetProps,
  CreateFileAssetProps,
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

export const TX_FEES = {
  create: BigInt('10000000000'),
  timedTransfer: BigInt('2500000000'),
  createCollection: BigInt('5000000000'),
};

export const sendCreateFileAsset = async (passphrase: string, asset: CreateFileAssetProps) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      moduleID: 1000,
      assetID: 1,
      fee: TX_FEES.create,
      asset,
    },
    passphrase,
  );

  return client.transaction.send(tx);
};

export const sendRequestFileOwnershipAsset = async (passphrase: string, asset: RequestFileOwnershipAssetProps) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      moduleID: 1000,
      assetID: 2,
      fee: BigInt(300000),
      asset,
    },
    passphrase,
  );

  return client.transaction.send(tx);
};

export const sendRequestFileAccessPermissionAsset = async (
  passphrase: string,
  asset: RequestFileAccessPermissionAssetProps,
) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      moduleID: 1000,
      assetID: 3,
      fee: BigInt(300000),
      asset,
    },
    passphrase,
  );

  return client.transaction.send(tx);
};

export const sendRequestFileTransferAsset = async (passphrase: string, asset: RequestFileTransferAssetProps) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      moduleID: 1000,
      assetID: 4,
      fee: BigInt(300000),
      asset,
    },
    passphrase,
  );

  return client.transaction.send(tx);
};

export const sendRespondToFileRequestAsset = async (passphrase: string, asset: RespondToFileRequestAssetProps) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      moduleID: 1000,
      assetID: 5,
      fee: BigInt(300000),
      asset,
    },
    passphrase,
  );

  return client.transaction.send(tx);
};

export const sendUpdateFileAsset = async (passphrase: string, asset: UpdateFileAssetProps) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      moduleID: 1000,
      assetID: 6,
      fee: BigInt(300000),
      asset,
    },
    passphrase,
  );

  return client.transaction.send(tx);
};

export const sendTimedTransferAsset = async (passphrase: string, asset: TimedTransferAssetProps) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      moduleID: 1000,
      assetID: 7,
      fee: TX_FEES.timedTransfer,
      asset,
    },
    passphrase,
  );

  return client.transaction.send(tx);
};

export const sendCreateCollectionAsset = async (passphrase: string, asset: CreateCollectionAssetProps) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      moduleID: 1000,
      assetID: 8,
      fee: TX_FEES.createCollection,
      asset,
    },
    passphrase,
  );

  return client.transaction.send(tx);
};

export const sendUpdateCollectionAsset = async (passphrase: string, asset: UpdateCollectionAssetProps) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      moduleID: 1000,
      assetID: 9,
      fee: BigInt(10000000),
      asset,
    },
    passphrase,
  );

  return client.transaction.send(tx);
};

export const sendRequestCollectionTransferAsset = async (
  passphrase: string,
  asset: RequestCollectionTransferAssetProps,
) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      moduleID: 1000,
      assetID: 10,
      fee: BigInt(10000000),
      asset,
    },
    passphrase,
  );

  return client.transaction.send(tx);
};

export const sendRespondToCollectionRequestAsset = async (
  passphrase: string,
  asset: RespondToCollectionRequestAssetProps,
) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      moduleID: 1000,
      assetID: 11,
      fee: BigInt(10000000),
      asset,
    },
    passphrase,
  );

  return client.transaction.send(tx);
};

export const sendCancelRequestAsset = async (passphrase: string, asset: CancelRequestAssetProps) => {
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      moduleID: 1000,
      assetID: 13,
      fee: BigInt(300000),
      asset,
    },
    passphrase,
  );

  return client.transaction.send(tx);
};
