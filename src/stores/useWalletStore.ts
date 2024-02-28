import { create } from 'zustand';

import { Wallet, WalletMap } from 'types';
import { generateWallet } from 'utils/crypto';
import { getFromLocalStorage, setToLocalStorage } from 'utils/storage';

type WalletState = {
  walletMap: WalletMap;
  addWallet: (email: string, wallet: Wallet) => void;
  removeWallet: (email: string) => void;
  addWalletViaPassphrase: (email: string, passphrase: string) => void;
  clearWalletMap: () => void;
};

const getInitialMap = (): WalletMap => {
  const data = getFromLocalStorage<any>('neatbox-wallet-map');

  if (typeof data === 'object' && data !== null && data?.liskAddress) {
    // Data is old wallet type used in versions before 1.2.0
    return {};
  }

  return data;
};

export const useWalletStore = create<WalletState>(set => ({
  walletMap: getInitialMap(),
  addWallet: (email, walletInput) =>
    set(state => {
      const wallet: Omit<Wallet, 'address'> = {
        lsk32address: walletInput.lsk32address,
        publicKey: walletInput.publicKey,
        passphrase: walletInput.passphrase,
      };

      const updatedMap = { ...state.walletMap };
      updatedMap[email] = wallet;
      setToLocalStorage(updatedMap, 'neatbox-wallet-map');
      return { ...state, walletMap: updatedMap };
    }),
  removeWallet: email =>
    set(state => {
      const updatedMap = { ...state.walletMap };
      delete updatedMap[email];

      setToLocalStorage(updatedMap, 'neatbox-wallet-map');

      return { ...state, walletMap: updatedMap };
    }),
  addWalletViaPassphrase: async (email, passphrase) => {
    const wallet = await generateWallet(passphrase);
    set(state => {
      const updatedMap = { ...state.walletMap };
      updatedMap[email] = wallet;

      setToLocalStorage(updatedMap, 'neatbox-wallet-map');
      return { ...state, walletMap: updatedMap };
    });
  },
  clearWalletMap: () =>
    set(() => {
      const emptyMap = {};

      setToLocalStorage(emptyMap, 'neatbox-wallet-map');

      return emptyMap;
    }),
}));
