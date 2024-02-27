import Button from 'components/ui/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ImportWalletModal from './ImportWalletModal';

type Props = {
  accountHasMappedWallet: boolean;
};

const WalletDialog = ({ accountHasMappedWallet }: Props) => {
  const [showImportWalletModal, setShowImportWalletModal] = useState(false);
  const navigate = useNavigate();

  if (accountHasMappedWallet) {
    return (
      <div className="w-full">
        <p className="text-center font-semibold mt-0 mb-6">Import your existing wallet</p>

        <div className="flex justify-center">
          <div className="text-center flex flex-col gap-4 w-64">
            <Button onClick={() => setShowImportWalletModal(true)}>Import</Button>
          </div>
        </div>

        <ImportWalletModal isOpen={showImportWalletModal} handleClose={() => setShowImportWalletModal(false)} />
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="text-center font-semibold mt-0 mb-6">Ready to get started?</p>

      <div className="flex justify-center">
        <div className="text-center flex flex-col gap-4 w-64">
          <Button onClick={() => navigate('/register')} disabled={accountHasMappedWallet}>
            Register Username
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WalletDialog;
