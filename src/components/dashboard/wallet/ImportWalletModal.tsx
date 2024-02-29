import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';

import Button from 'components/ui/Button';
import Modal from 'components/ui/Modal';
import useWallet from 'hooks/useWallet';
import { fetchAggregatedAccount } from 'services/api';
import { getLisk32AddressFromPassphrase, hashEmail, validatePassphrase } from 'utils/crypto';

type Props = {
  isOpen: boolean;
  handleClose: () => void;
};

const ImportWalletModal = ({ isOpen, handleClose }: Props) => {
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth0();

  const { addWalletViaPassphrase } = useWallet();

  /**
   * Verify if passphrase matches on-chain account
   */
  const handleImportWallet = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    setError('');

    const errors = validatePassphrase(passphrase);

    if (errors.length) {
      setError(errors[0].message);
      return;
    }

    const account = await fetchAggregatedAccount(await getLisk32AddressFromPassphrase(passphrase));

    if (account?.emailHash !== hashEmail(user?.email ?? '')) {
      setError('Passphrase does not match wallet registered to account');
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
