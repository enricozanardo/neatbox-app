import { useAuth0 } from '@auth0/auth0-react';
import PageTitle from 'components/ui/PageTitle';
import SuccessScreen from 'components/ui/SuccessScreen';
import useAccountData from 'hooks/useAccountData';
import { useCollectionData } from 'hooks/useCollectionData';
import { useState } from 'react';
import useWallet from 'hooks/useWallet';

import TransferCollectionForm from './TransferCollectionForm';

type Props = {
  defaultValue: string | null;
};

const TransferCollection = ({ defaultValue }: Props) => {
  const [success, setSuccess] = useState(false);

  const { wallet } = useWallet();
  const { isAuthenticated } = useAuth0();
  const { account } = useAccountData();
  const { collections } = useCollectionData(
    account?.storage.collectionsOwned ?? [],
    { limit: -1 },
    ['account', 'collectionsOwned'],
    undefined,
    defaultValue ? 5000 : undefined, // refetch collections if being referred from other page
  );

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
