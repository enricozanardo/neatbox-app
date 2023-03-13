declare module '@liskhq/lisk-client/browser' {
  const apiClient: typeof import('@liskhq/lisk-api-client');
  const cryptography: typeof import('@liskhq/lisk-cryptography');
  const passphrase: typeof import('@liskhq/lisk-passphrase');
  const transactions: typeof import('@liskhq/lisk-transactions');
  const utils: typeof import('@liskhq/lisk-utils');
  const tree: typeof import('@liskhq/lisk-tree');
  const validator: typeof import('@liskhq/lisk-validator');
  const codec: typeof import('@liskhq/lisk-codec');
}
