import { Wallet, WalletMap } from 'types';
import { generateWallet } from 'utils/crypto';
import { getFromLocalStorage, setToLocalStorage } from 'utils/storage';
import { create } from 'zustand';

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
  addWallet: (email, wallet) =>
    set(state => {
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
  addWalletViaPassphrase: (email, passphrase) =>
    set(state => {
      const wallet = generateWallet(passphrase);
      const updatedMap = { ...state.walletMap };
      updatedMap[email] = wallet;

      setToLocalStorage(updatedMap, 'neatbox-wallet-map');
      return { ...state, walletMap: updatedMap };
    }),
  clearWalletMap: () =>
    set(() => {
      const emptyMap = {};

      setToLocalStorage(emptyMap, 'neatbox-wallet-map');

      return emptyMap;
    }),
}));
