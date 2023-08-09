import { useAuth0 } from '@auth0/auth0-react';
import useAccountData from 'hooks/useAccountData';
import { useAccountMapEntry } from 'hooks/useAccountMapEntry';
import { useEffect, useState } from 'react';
import useWallet from 'hooks/useWallet';

import WalletDialog from './WalletDialog';
import WalletDisplay from './WalletDisplay';

const Wallet = () => {
  const [accountHasMappedWallet, setAccountHasMappedWallet] = useState(true);

  const { wallet } = useWallet();
  const { account } = useAccountData();
  const { user } = useAuth0();
  const { map } = useAccountMapEntry(user?.email);

  useEffect(() => {
    if (account?.storage.map || map?.binaryAddress) {
      setAccountHasMappedWallet(true);
      return;
    }

    setAccountHasMappedWallet(false);
  }, [account?.storage.map, map?.binaryAddress]);

  return (
    <div>
      {(!wallet || (wallet && !accountHasMappedWallet)) && (
        <WalletDialog email={user?.email} map={map} accountHasMappedWallet={accountHasMappedWallet} />
      )}

      {wallet && accountHasMappedWallet && <WalletDisplay wallet={wallet} />}
    </div>
  );
};

export default Wallet;
