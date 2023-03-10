export type Params = Record<string, string | number>;

export type Wallet = {
  liskAddress: string;
  binaryAddress: string;
  publicKey: string;
  passphrase: string;
};

export enum ApiAction {
  GetAccount = 'app:getAccount',
  GetFiles = 'apiPlugin:getFiles',
  GetFileById = 'apiPlugin:getFileById',
  GetFilesByIds = 'apiPlugin:getFilesByIds',
  GetFileByHash = 'apiPlugin:getFileByHash',
  GetFilesByHashes = 'apiPlugin:getFilesByHashes',
  GetFileByChecksum = 'apiPlugin:getFileByChecksum',
  GetCollections = 'apiPlugin:getCollections',
  GetCollectionById = 'apiPlugin:getCollectionById',
  GetCollectionsByIds = 'apiPlugin:getCollectionsByIds',
  GetStorageStatistics = 'apiPlugin:getStatistics',
  GetAccountMapEntryByEmailHash = 'apiPlugin:getAccountMapEntryByEmailHash',
  getAccountMapEntryByUsername = 'apiPlugin:getAccountMapEntryByUsername',
  AccountExists = 'apiPlugin:accountExists',
}

export enum EventType {
  NewBlock = 'app:block:new',
  NewTransaction = 'app:transaction:new',
}

export interface DateTimeMetadata {
  unix: number;
  human: string;
}

export interface Meta {
  createdAt: DateTimeMetadata;
  lastModified: DateTimeMetadata;
  expiration: DateTimeMetadata;
  collection: {
    id: string;
    title: string;
  };
}

export enum FileRequestType {
  Ownership = 'OWNERSHIP',
  AccessPermission = 'ACCESS_PERMISSION',
  Transfer = 'TRANSFER',
  TimedTransfer = 'TIMED_TRANSFER',
}

export type FileRequest = {
  fileId: string;
  requestId: string;
  type: FileRequestType;
  sender: Buffer;
};

export type FileData = {
  title: string;
  id: string;
  name: string;
  size: number;
  type: string;
  checksum: string;
  hash: string;
  owner: Buffer;
  customFields: Buffer;
  transferFee: number;
  accessPermissionFee: number;
  requests: FileRequest[];
  history: HistoryItem[];
  private: boolean;
};

export type File = {
  meta: Meta;
  data: FileData;
};

export type StorageStatistics = {
  files: number;
  transfers: number;
};

export type CreateFileAssetProps = Omit<FileData, 'owner' | 'id' | 'requests' | 'history'> & {
  transferFee: number;
  accessPermissionFee: number;
  private: boolean;
  timestamp: number;
};

export type RequestFileOwnershipAssetProps = {
  id: string;
  timestamp: number;
};

export type RequestFileAccessPermissionAssetProps = {
  id: string;
  timestamp: number;
};

export type RequestFileTransferAssetProps = {
  fileId: string;
  recipientAddress: Buffer;
  timestamp: number;
};

export type RespondToFileRequestAssetProps = {
  fileId: string;
  requestId: string;
  accept: boolean;
  newHash: string;
  timestamp: number;
};

export type TimedTransferAssetProps = Omit<FileData, 'owner' | 'id' | 'requests' | 'history'> & {
  transferFee: number;
  recipientEmailHash: string;
  timestamp: number;
};

export type UpdateFileAssetProps = {
  fileId: string;
  transferFee: number;
  accessPermissionFee: number;
  private: boolean;
  customFields: Buffer;
  timestamp: number;
};

export type CreateCollectionAssetProps = {
  title: string;
  transferFee: number;
  timestamp: number;
};

export type UpdateCollectionAssetProps = {
  collectionId: string;
  transferFee: number;
  fileIds: string[];
  timestamp: number;
};

export type RequestCollectionTransferAssetProps = {
  collectionId: string;
  recipientAddress: Buffer;
  timestamp: number;
};

export type RespondToCollectionRequestAssetProps = {
  collectionId: string;
  requestId: string;
  accept: boolean;
  updatedFileData: {
    fileId: string;
    newHash: string;
  }[];
  timestamp: number;
};

export type InitWalletAssetProps = {
  emailHash: string;
  username: string;
  timestamp: number;
};

export type CancelRequestAssetProps = {
  requestId: string;
  collectionId: string;
  fileId: string;
  timestamp: number;
};

export type StorageModuleAccountProps = {
  storage: {
    filesOwned: string[];
    filesAllowed: string[];
    collectionsOwned: string[];
    collectionsAllowed: string[];
    incomingFileRequests: { fileId: string; requestId: string }[];
    outgoingFileRequests: { fileId: string; requestId: string }[];
    incomingCollectionRequests: { collectionId: string; requestId: string }[];
    outgoingCollectionRequests: { collectionId: string; requestId: string }[];
    map: {
      username: string;
      emailHash: string;
    };
  };
};

export type AccountProps = StorageModuleAccountProps & {
  address: Buffer;
  token: {
    balance: bigint;
  };
};

export enum HistoryItemType {
  Registration = 'REGISTRATION',
  Transfer = 'TRANSFER',
  AccessPermission = 'ACCESS_PERMISSION',
  TimedTransferSubmission = 'TIMED_TRANSFER_SUBMISSION',
  TimedTransferResponse = 'TIMED_TRANSFER_RESPONSE',
  AddedToCollection = 'ADDED_TO_COLLECTION',
  RemovedFromCollection = 'REMOVED_FROM_COLLECTION',
  TransferredViaCollection = 'TRANSFERRED_VIA_COLLECTION',
}

export type HistoryItem = {
  id: string;
  createdAt: DateTimeMetadata;
  activity: HistoryItemType;
  userAddress: Buffer;
};

export type Transaction<Asset> = {
  asset: Asset;
  assetID: number;
  fee: BigInt;
  id: Buffer;
  moduleID: number;
  nonce: BigInt;
  senderPublicKey: Buffer;
  signatures: any;
};

export type Collection = {
  id: string;
  title: string;
  owner: Buffer;
  fileIds: string[];
  transferFee: number;
  requests: CollectionRequest[];
};

export type CollectionRequest = {
  collectionId: string;
  requestId: string;
  sender: Buffer;
  recipient: Buffer;
};

export type AccountMapEntry = {
  binaryAddress: string;
  emailHash: string;
};

export type Filters = {
  searchInput?: string;
  mimeType?: string;
  sortType?: string;
  isUpdated?: boolean;
};

export type ApiOptions = { offset?: number; limit?: number; filters?: Filters };
