import { APIClient } from '@liskhq/lisk-api-client';
import { apiClient } from '@liskhq/lisk-client/browser';

import config from 'config';
import {
  AccountProps,
  ApiAction,
  ApiOptions,
  ApiResponse,
  Collection,
  EventType,
  MapStoreData,
  NeatboxFile,
  StatisticStoreData,
  Transaction,
} from 'types';
import { bufferToHex } from 'utils/crypto';
import { sanitizeBuffers } from 'utils/helpers';

const RPC_ENDPOINT = config.BLOCKCHAIN_API;

export let clientCache: APIClient;

export const getClient = async () => {
  if (!RPC_ENDPOINT) {
    throw new Error('No RPC endpoint defined');
  }

  let shouldCreateNewClient = true;

  // @ts-ignore
  if (clientCache && clientCache.node._channel.isAlive) {
    shouldCreateNewClient = false;
  }

  if (shouldCreateNewClient) {
    clientCache = await apiClient.createWSClient(RPC_ENDPOINT);
  }

  return clientCache;
};

export const clientIsOnline = async () => {
  if (!clientCache) {
    return false;
  }

  // @ts-ignore
  if (!clientCache.node._channel.isAlive) {
    return false;
  }

  return true;
};

export const subscribeToEvent = async (handler: (data?: any) => void, event: EventType) => {
  const client = await getClient();
  client.subscribe(event, data => handler(data));
};

export const invokeAction = async <T>(action: ApiAction, args: Record<string, unknown> = {}) => {
  const client = await getClient();
  const response = await client.invoke<ApiResponse<T>>(action, args);
  return sanitizeBuffers(response);
};

export const fetchAggregatedAccount = async (address: string) => {
  const result = await invokeAction<AccountProps>(ApiAction.GetAggregatedAccount, { address });
  return result.data;
};

export const fetchTx = async <T>(id: string): Promise<Transaction<T>> => {
  const client = await getClient();
  const tx = (await client.transaction.get(id)) as unknown as Transaction<T>;
  return tx;
};

export const getPublicKeyFromTransaction = async (txId: string) => {
  const tx = await fetchTx(txId);

  const publicKey = tx.senderPublicKey;

  if (!publicKey) {
    throw Error('Error fetching public key');
  }

  return bufferToHex(tx.senderPublicKey);
};

export const fetchMapByEmailHashOrUsername = async (data: { username: string } | { emailHash: string }) => {
  const result = await invokeAction<MapStoreData>(ApiAction.GetEmailOrUsernameMap, data);
  return result.data;
};

export const getFiles = async (options: ApiOptions = {}) => {
  const result = await invokeAction<{ files: NeatboxFile[]; total: number }>(ApiAction.GetFiles, { ...options });
  return result.data;
};

export const getFilesByIds = async (fileIds: string[], options: ApiOptions = {}) => {
  const result = await invokeAction<{ files: NeatboxFile[]; total: number }>(ApiAction.GetFilesByIds, {
    ids: fileIds,
    ...options,
  });
  return result.data;
};

export const getFileById = async (id: string) => {
  const result = await invokeAction<NeatboxFile>(ApiAction.GetFileById, { id });
  return result.data;
};

export const getFileByChecksum = async (checksum: string) => {
  const result = await invokeAction<NeatboxFile>(ApiAction.GetFileByChecksum, { checksum });
  return result.data;
};

export const getCollectionsByIds = async (ids: string[], options: ApiOptions = {}) => {
  const result = await invokeAction<{ collections: Collection[]; total: number }>(ApiAction.GetCollectionsByIds, {
    ids,
    ...options,
  });
  return result.data;
};

export const getCollectionById = async (id: string) => {
  const result = await invokeAction<Collection>(ApiAction.GetCollectionById, { id });
  return result.data;
};

export const getStatistics = async () => {
  const result = await invokeAction<StatisticStoreData>(ApiAction.GetStorageStatistics);
  return result.data;
};
