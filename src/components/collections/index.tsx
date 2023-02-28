import CollectionTable from 'components/collections/CollectionTable';
import PageTitle from 'components/ui/PageTitle';
import TransferConfirmationSpinner from 'components/ui/TransferConfirmationSpinner';
import useAccountData from 'hooks/useAccountData';
import { useCollectionData } from 'hooks/useCollectionData';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import CreateCollection from './CreateCollection';

const Collections = () => {
  const { account } = useAccountData();
  const { collections, optimisticallyAddCollection, optimisticallyUpdateCollection } = useCollectionData(
    account?.storage.collectionsOwned ?? [],
    { limit: -1 },
    ['account', 'collectionsOwned'],
  );
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);

  const ref = searchParams.get('ref');
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  };

  useEffect(() => {
    if (ref) {
      setIsProcessing(true);
    }

    timeout.current = setTimeout(() => {
      setIsProcessing(false);
      clearTimer();
    }, 10000 + 5000);
  }, [ref]);

  useEffect(() => {
    if (account?.storage.collectionsOwned && account.storage.collectionsOwned.includes(ref || '')) {
      setIsProcessing(false);
      clearTimer();
    }
  }, [account?.storage.collectionsOwned, ref]);

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const accountHasCollections = !!(account && account.storage.collectionsOwned.length > 0);

  return (
    <div className="mb-32">
      <PageTitle text="My Collections" />
      {accountHasCollections && (
        <CollectionTable data={collections} optimisticallyUpdateCollection={optimisticallyUpdateCollection} />
      )}
      {isProcessing && <TransferConfirmationSpinner />}
      {!isProcessing && (
        <CreateCollection
          accountHasCollections={accountHasCollections}
          optimisticallyAddCollection={optimisticallyAddCollection}
        />
      )}
    </div>
  );
};

export default Collections;
