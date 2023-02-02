import { Wallet } from 'types';
import { generateWallet } from 'utils/crypto';
import { getFromLocalStorage, removeItemFromStorage, setToLocalStorage } from 'utils/storage';
import { create } from 'zustand';

type WalletState = {
  wallet: Wallet | null;
  addWallet: (wallet: Wallet) => void;
  removeWallet: () => void;
  addWalletViaPassphrase: (passphrase: string) => void;
};

export const useWalletStore = create<WalletState>(set => ({
  wallet: getFromLocalStorage<Wallet>('wallet'),
  addWallet: wallet =>
    set(() => {
      setToLocalStorage(wallet, 'wallet');
      return { wallet };
    }),
  removeWallet: () =>
    set(() => {
      removeItemFromStorage('wallet');
      return { wallet: null };
    }),
  addWalletViaPassphrase: passphrase =>
    set(() => {
      const wallet = generateWallet(passphrase);
      setToLocalStorage(wallet, 'wallet');
      return { wallet };
    }),
}));
