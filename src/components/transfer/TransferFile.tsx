import { useAuth0 } from '@auth0/auth0-react';
import PageTitle from 'components/ui/PageTitle';
import SuccessScreen from 'components/ui/SuccessScreen';
import useAccountData from 'hooks/useAccountData';
import { useFileData } from 'hooks/useFileData';
import { useState } from 'react';
import { useWalletStore } from 'stores/useWalletStore';

import TransferFileForm from './TransferFileForm';

type Props = {
  defaultValue: string | null;
};

const TransferFile = ({ defaultValue }: Props) => {
  const [success, setSuccess] = useState(false);
  const wallet = useWalletStore(state => state.wallet);
  const { isAuthenticated } = useAuth0();
  const { account } = useAccountData();
  const { files } = useFileData(account?.storage.filesOwned ?? [], { limit: -1 }, ['account', 'filesOwned']);

  const reset = () => {
    setSuccess(false);
  };

  if (success) {
    return <SuccessScreen reset={reset} type="Transfer" />;
  }

  return (
    <div className="flex justify-center">
      <div className="w-full">
        <div className="mb-24">
          <PageTitle text="Transfer File" />

          <TransferFileForm
            files={files.filter(f => !f.meta.collection.id && !f.meta.expiration.unix)}
            defaultValue={defaultValue}
            wallet={wallet}
            isAuthenticated={isAuthenticated}
            setSuccess={setSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default TransferFile;
