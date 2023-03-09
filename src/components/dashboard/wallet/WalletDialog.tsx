import Button from 'components/ui/Button';
import Hr from 'components/ui/Hr';
import { useState } from 'react';
import { AccountMapEntry } from 'types';

import CreateWalletModal from './CreateWalletModal';
import ImportWalletModal from './ImportWalletModal';

type Props = {
  email?: string;
  map?: AccountMapEntry;
  accountHasMappedWallet: boolean;
};

const WalletDialog = ({ email, map, accountHasMappedWallet }: Props) => {
  const [showImportWalletModal, setShowImportWalletModal] = useState(false);
  const [showCreateWalletModal, setShowCreateWalletModal] = useState(false);

  return (
    <div className="w-full">
      <p className="text-center font-semibold mt-0 mb-12">Ready to get started?</p>

      <div className="flex justify-center">
        <div className="text-center flex flex-col gap-4 w-64">
          <Button onClick={() => setShowCreateWalletModal(true)} disabled={accountHasMappedWallet}>
            Create Your Wallet
          </Button>
          <Hr text="or" />
          <Button onClick={() => setShowImportWalletModal(true)}>Import Your Wallet</Button>
        </div>
      </div>

      <ImportWalletModal
        accountMap={map}
        isOpen={showImportWalletModal}
        handleClose={() => setShowImportWalletModal(false)}
      />
      <CreateWalletModal isOpen={showCreateWalletModal} handleClose={() => setShowCreateWalletModal(false)} />
    </div>
  );
};

export default WalletDialog;
