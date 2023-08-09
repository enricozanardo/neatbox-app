import { cryptography } from '@liskhq/lisk-client/browser';
import Button from 'components/ui/Button';
import Modal from 'components/ui/Modal';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { fetchUser } from 'services/api';
import useWallet from 'hooks/useWallet';
import { AccountMapEntry } from 'types';
import { validatePassphrase } from 'utils/crypto';
import { devLog } from 'utils/helpers';

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  accountMap?: AccountMapEntry;
};

const ImportWalletModal = ({ isOpen, handleClose, accountMap }: Props) => {
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');
  const { addWalletViaPassphrase } = useWallet();

  const handleImportWallet = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    setError('');

    const errors = validatePassphrase(passphrase);

    if (errors.length) {
      setError(errors[0].message);
      return;
    }

    const binaryAddress = cryptography.getAddressFromPassphrase(passphrase).toString('hex');

    if (accountMap && accountMap.binaryAddress && binaryAddress !== accountMap.binaryAddress) {
      setError('Passphrase does not match wallet registered to account');
      return;
    }

    const account = await fetchUser(binaryAddress).catch(err => {
      devLog(err);
      return undefined;
    });

    if (!account?.storage.map.emailHash) {
      toast.error('Account has no wallet linked to it');
      return;
    }

    updateWallet();
  };

  const reset = () => {
    setError('');
    setPassphrase('');
  };

  const updateWallet = () => {
    addWalletViaPassphrase(passphrase);
    handleClose();
  };

  return (
    <Modal title="Import Wallet" isOpen={isOpen} handleClose={handleClose}>
      <form onSubmit={handleImportWallet}>
        <div className="text-center mb-8">
          <input
            placeholder="Enter passphrase.."
            value={passphrase}
            type="text"
            className="base-input"
            onChange={e => setPassphrase(e.target.value)}
          />

          {error && <p className="text-red-400 text-sm mb-4 mt-1">{error}</p>}
        </div>

        <div className="flex justify-center gap-4">
          <Button type="button" color="primary-bordered" onClick={reset}>
            Reset
          </Button>
          <Button type="submit">Import</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ImportWalletModal;
