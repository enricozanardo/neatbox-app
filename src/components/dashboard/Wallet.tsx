import { useAuth0 } from '@auth0/auth0-react';
import { useAccountMapEntry } from 'hooks/useAccountMapEntry';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { sendInitWalletAsset } from 'services/transactions';
import { useAccountStore } from 'stores/useAccountStore';
import { useWalletStore } from 'stores/useWalletStore';
import { InitWalletAssetProps } from 'types';
import { hashEmail } from 'utils/crypto';
import { getTransactionTimestamp } from 'utils/helpers';

import WalletActions from './WalletActions';
import WalletDialog from './WalletDialog';
import WalletDisplay from './WalletDisplay';

const Wallet = () => {
  const [accountHasMappedWallet, setAccountHasMappedWallet] = useState(true);

  const { wallet, removeWallet } = useWalletStore(state => ({
    wallet: state.wallet,
    removeWallet: state.removeWallet,
  }));

  const { account, setIgnoreRefresh } = useAccountStore(state => ({
    account: state.account,
    setIgnoreRefresh: state.setIgnoreRefresh,
  }));

  const { user } = useAuth0();
  const { map } = useAccountMapEntry(user?.email);

  useEffect(() => {
    if (account?.storage.map || map?.binaryAddress) {
      setAccountHasMappedWallet(true);
      return;
    }

    setAccountHasMappedWallet(false);
  }, [account?.storage.map, map?.binaryAddress]);

  const initializeWallet = async () => {
    if (!user?.email) {
      toast.error('No e-mail found');
      return;
    }

    if (!wallet?.passphrase) {
      toast.error('No wallet found');
      return;
    }

    const emailHash = hashEmail(user.email);

    const txAsset: InitWalletAssetProps = {
      emailHash,
      timestamp: getTransactionTimestamp(),
    };

    try {
      await sendInitWalletAsset(wallet.passphrase, txAsset);
      setIgnoreRefresh(true);
      setAccountHasMappedWallet(true);
      toast.success('Wallet successfully locked to user account!');
    } catch (err) {
      // Todo: create proper error handler

      const error = err as any;
      let msg = JSON.stringify(error.message);
      toast.error(msg);
      console.error(msg);
    }
  };

  return (
    <div>
      {!wallet && <WalletDialog email={user?.email} map={map} accountHasMappedWallet={accountHasMappedWallet} />}

      {wallet && (
        <>
          <WalletDisplay wallet={wallet} />

          {!accountHasMappedWallet && <WalletActions initializeWallet={initializeWallet} removeWallet={removeWallet} />}
        </>
      )}
    </div>
  );
};

export default Wallet;
