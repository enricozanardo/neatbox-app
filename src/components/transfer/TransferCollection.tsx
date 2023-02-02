import { useAuth0 } from '@auth0/auth0-react';
import PageTitle from 'components/ui/PageTitle';
import SuccessScreen from 'components/ui/SuccessScreen';
import { useOwnedCollectionData } from 'hooks/useOwnedCollectionData';
import { useState } from 'react';
import { useWalletStore } from 'stores/useWalletStore';

import TransferCollectionForm from './TransferCollectionForm';

type Props = {
  defaultValue: string | null;
};

const TransferCollection = ({ defaultValue }: Props) => {
  const [success, setSuccess] = useState(false);
  const wallet = useWalletStore(state => state.wallet);
  const { isAuthenticated } = useAuth0();
  const { collections } = useOwnedCollectionData({ limit: -1 });

  const reset = () => {
    setSuccess(false);
  };

  if (success) {
    return <SuccessScreen reset={reset} type="Transfer" />;
  }

  const applicableCollections = collections.filter(c => c.fileIds.length > 0);

  return (
    <div className="flex justify-center">
      <div className="w-full">
        <div className="mb-24">
          <PageTitle text="Transfer Collection" />

          <TransferCollectionForm
            collections={applicableCollections}
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

export default TransferCollection;
