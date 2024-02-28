import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

import { useEmailMap } from 'hooks/useEmailMap';
import useWallet from 'hooks/useWallet';
import WalletDialog from './WalletDialog';
import WalletDisplay from './WalletDisplay';

const Wallet = () => {
  const [accountHasMappedWallet, setAccountHasMappedWallet] = useState(true);
  const { user } = useAuth0();

  const { map } = useEmailMap(user?.email);
  const { wallet } = useWallet();

  useEffect(() => {
    if (map?.lsk32address && map?.username) {
      setAccountHasMappedWallet(true);
      return;
    }

    setAccountHasMappedWallet(false);
  }, [map?.lsk32address, map?.username]);

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
