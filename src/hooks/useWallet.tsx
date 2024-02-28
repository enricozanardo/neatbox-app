import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

import { useWalletStore } from 'stores/useWalletStore';
import { Wallet } from 'types';

const useWallet = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const { user } = useAuth0();
  const { walletMap, addWallet, addWalletViaPassphrase, removeWallet } = useWalletStore();

  useEffect(() => {
    if (!user?.email) {
      return;
    }

    const wallet = walletMap?.[user.email] ?? null;

    setWallet(wallet);
  }, [user?.email, walletMap]);

  const handleAddWallet = (wallet: Wallet) => {
    if (!user?.email) {
      return;
    }

    addWallet(user.email, wallet);
  };

  const handleAddWalletViaPassphrase = (passphrase: string) => {
    if (!user?.email) {
      return;
    }

    addWalletViaPassphrase(user.email, passphrase);
  };

  const handleRemoveWallet = () => {
    if (!user?.email) {
      return;
    }

    removeWallet(user.email);
  };

  return {
    wallet,
    addWallet: handleAddWallet,
    addWalletViaPassphrase: handleAddWalletViaPassphrase,
    removeWallet: handleRemoveWallet,
  };
};

export default useWallet;
