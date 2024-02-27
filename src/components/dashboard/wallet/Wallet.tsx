import { useAuth0 } from '@auth0/auth0-react';
import useAccountData from 'hooks/useAccountData';
import { useEffect, useState } from 'react';
import useWallet from 'hooks/useWallet';

import WalletDialog from './WalletDialog';
import WalletDisplay from './WalletDisplay';

const Wallet = () => {
  const [accountHasMappedWallet, setAccountHasMappedWallet] = useState(true);

  const { wallet } = useWallet();
  const { account } = useAccountData();
  const { user } = useAuth0();

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
