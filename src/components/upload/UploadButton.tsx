import Button from 'components/ui/Button';
import Icon from 'components/ui/Icon';
import { TX_FEES } from 'services/transactions';
import { useAccountStore } from 'stores/useAccountStore';
import { Wallet } from 'types';
import { beddowsToLsk } from 'utils/formatting';

type Props = {
  isAuthenticated: boolean;
  isTimedTransfer: boolean;
  wallet: Wallet | null;
};

const UploadButton = ({ isAuthenticated, wallet, isTimedTransfer }: Props) => {
  const account = useAccountStore(state => state.account);

  const accountIsMapped = account?.storage.map;

  const getText = () => {
    if (wallet && isAuthenticated && accountIsMapped) {
      if (isTimedTransfer) {
        return `Sending a timed transfer requires ${beddowsToLsk(TX_FEES.timedTransfer)} tokens`;
      }

      if (!isTimedTransfer) {
        return `Uploading a file requires ${beddowsToLsk(TX_FEES.create)} tokens`;
      }
    }

    if (!isAuthenticated) {
      return 'Please log in to upload a file';
    }

    if (!accountIsMapped) {
      return 'Please initialize your account before uploading';
    }

    if (isAuthenticated) {
      return 'Please create or import a wallet to upload a file';
    }

    return 'Fallback';
  };

  return (
    <div className="text-center">
      <Button size="lg" type="submit" disabled={!isAuthenticated || !wallet || !accountIsMapped}>
        Upload File
      </Button>

      <p className="text-sm mt-4 text-gray-400">
        <Icon type="faLock" /> <span>{getText()}</span>
      </p>
    </div>
  );
};

export default UploadButton;
