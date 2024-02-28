import { useState } from 'react';
import { toast } from 'react-hot-toast';

import Button from 'components/ui/Button';
import Modal from 'components/ui/Modal';
import useAccountData from 'hooks/useAccountData';
import useWallet from 'hooks/useWallet';

import { PassphraseValidator } from './PassphraseValidator';

const DangerZone = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { removeAccountCache } = useAccountData();

  const { wallet, removeWallet } = useWallet();

  const handleRemoveWallet = () => {
    removeWallet();
    removeAccountCache();
    toast.success('Wallet successfully removed');
  };

  if (!showSettings) {
    return <PassphraseValidator onSuccess={() => setShowSettings(true)} wallet={wallet} />;
  }

  return (
    <>
      <div className="text-center">
        <Button color="danger-bordered" onClick={() => setModalIsOpen(true)} disabled={!!!wallet}>
          Remove Wallet Data
        </Button>
      </div>

      <Modal title="Remove Wallet from Browser" isOpen={modalIsOpen} handleClose={() => setModalIsOpen(false)}>
        <div className="text-center mb-8">
          <span className="font-bold">Attention!</span>
          <br />
          This will remove your wallet from the browser session. Make sure you have your passphrase backed up, as you
          will need it next time to re-import your wallet to your account.
        </div>

        <div className="flex justify-center gap-4">
          <Button type="button" color="primary-bordered" onClick={() => setModalIsOpen(false)}>
            Cancel
          </Button>

          <Button onClick={handleRemoveWallet}>Confirm</Button>
        </div>
      </Modal>
    </>
  );
};

export default DangerZone;
