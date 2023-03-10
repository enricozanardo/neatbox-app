import { APIClient } from '@liskhq/lisk-api-client';
import { apiClient } from '@liskhq/lisk-client/browser';
import config from 'config';
import { AccountMapEntry, AccountProps, ApiAction, ApiOptions, Collection, EventType, File, Transaction } from 'types';
import { bufferToHex } from 'utils/crypto';

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

export const subscribeToEvent = async (handler: (data?: any) => void, event: EventType) => {
  const client = await getClient();
  client.subscribe(event, data => handler(data));
};

export const invokeAction = async <T>(action: ApiAction, args: Record<string, unknown> = {}): Promise<T> => {
  const client = await getClient();
  const response = await client.invoke<T>(action, args);
  return response;
};

export const fetchUser = async (address: string): Promise<AccountProps> => {
  const client = await getClient();
  const response: unknown = await client.account.get(address);
  return response as AccountProps;
};

export const fetchTx = async <T>(id: string): Promise<Transaction<T>> => {
  const client = await getClient();
  const tx = (await client.transaction.get(id)) as unknown as Transaction<T>;
  return tx;
};

export const fetchAccountMapEntry = async (emailHash: string) => {
  return invokeAction<AccountMapEntry>(ApiAction.GetAccountMapEntryByEmailHash, { emailHash });
};

export const getPublicKeyFromTransaction = async (txId: string) => {
  const tx = await fetchTx(txId);

  const publicKey = tx.senderPublicKey;

  if (!publicKey) {
    throw Error('Error fetching public key');
  }

  return bufferToHex(tx.senderPublicKey);
};

export const getFiles = async (options: ApiOptions = {}) => {
  return invokeAction<{ files: File[]; total: number }>(ApiAction.GetFiles, { ...options });
};

export const getFilesByIds = async (fileIds: string[], options: ApiOptions = {}) => {
  return invokeAction<{ files: File[]; total: number }>(ApiAction.GetFilesByIds, {
    ids: fileIds,
    ...options,
  });
};

export const getFileById = async (id: string) => {
  return invokeAction<File>(ApiAction.GetFileById, { id });
};

export const getCollectionsByIds = (ids: string[], options: ApiOptions = {}) => {
  return invokeAction<{ collections: Collection[]; total: number }>(ApiAction.GetCollectionsByIds, {
    ids,
    ...options,
  });
};

export const getCollectionById = async (id: string) => {
  return invokeAction<Collection>(ApiAction.GetCollectionById, { id });
};
