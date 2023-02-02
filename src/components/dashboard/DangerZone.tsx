import Button from 'components/ui/Button';
import Modal from 'components/ui/Modal';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useWalletStore } from 'stores/useWalletStore';
import { Wallet } from 'types';

const PassphraseValidator = ({ onSuccess, wallet }: { onSuccess: () => void; wallet: Wallet | null }) => {
  const [passphrase, setPassphrase] = useState('');

  const onSubmit = () => {
    if (passphrase !== wallet?.passphrase) {
      toast.error('Invalid passphrase');
      return;
    }

    onSuccess();
    toast.success('Settings revealed');
  };

  return (
    <div className="text-center">
      <input
        type="text"
        className="base-input mb-4"
        value={passphrase}
        onChange={e => setPassphrase(e.target.value)}
        placeholder="Enter passphrase to reveal settings.."
      />

      <Button onClick={onSubmit} color="primary-bordered">
        Validate
      </Button>
    </div>
  );
};

const DangerZone = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { wallet, removeWallet } = useWalletStore(state => ({
    wallet: state.wallet,
    removeWallet: state.removeWallet,
  }));

  const handleRemoveWallet = () => {
    removeWallet();
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
          will need it for re-linking your wallet to your account.
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
