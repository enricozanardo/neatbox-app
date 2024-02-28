import useAccountData from 'hooks/useAccountData';
import useWallet from 'hooks/useWallet';
import { useEffect, useState } from 'react';

import WalletDialog from './WalletDialog';
import WalletDisplay from './WalletDisplay';

const Wallet = () => {
  const [accountHasMappedWallet, setAccountHasMappedWallet] = useState(true);

  const { wallet } = useWallet();
  const { account } = useAccountData();

  useEffect(() => {
    if (account?.email && account?.username) {
      setAccountHasMappedWallet(true);
      return;
    }

    setAccountHasMappedWallet(false);
  }, [account]);

  return (
    <div>
      {(!wallet || (wallet && !accountHasMappedWallet)) && (
        <WalletDialog accountHasMappedWallet={accountHasMappedWallet} />
      )}

      {wallet && accountHasMappedWallet && <WalletDisplay wallet={wallet} />}
    </div>
  );
};

export default Wallet;
