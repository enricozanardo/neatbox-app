import Button from 'components/ui/Button';
import Modal from 'components/ui/Modal';
import config from 'config';
import useAccountData from 'hooks/useAccountData';
import { useState } from 'react';

type Props = {
  removeWallet: () => void;
  initializeWallet: () => void;
};

const WalletActions = ({ removeWallet, initializeWallet }: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { account } = useAccountData();

  const isAbleToInitializeWallet = account && account.token.balance > BigInt('0');

  return (
    <div className="flex justify-center mt-8 gap-4">
      <Button size="sm" color="danger-bordered" onClick={removeWallet}>
        Remove Wallet
      </Button>

      {!isAbleToInitializeWallet && (
        <a href={config.FAUCET} target="_blank" rel="noreferrer" className="text-black">
          <Button>Get Tokens</Button>
        </a>
      )}

      {isAbleToInitializeWallet && (
        <Button size="sm" color="primary" onClick={() => setModalIsOpen(true)}>
          Lock Wallet to Account
        </Button>
      )}

      <Modal title="Lock Wallet To Account" isOpen={modalIsOpen} handleClose={() => setModalIsOpen(false)}>
        <div className="text-center mb-8">
          <span className="font-bold">Attention!</span>
          <br />
          This will lock your wallet to your account and can not be undone.
        </div>

        <div className="flex justify-center gap-4">
          <Button type="button" color="primary-bordered" onClick={() => setModalIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={initializeWallet}>Confirm</Button>
        </div>
      </Modal>
    </div>
  );
};

export default WalletActions;
