import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import useAccountData from 'hooks/useAccountData';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { getCollectionById, getFilesByIds } from 'services/api';
import { sendRequestCollectionOwnershipAsset } from 'services/transactions';
import useWallet from 'hooks/useWallet';
import { RequestCollectionOwnershipAssetProps } from 'types';
import { handleError } from 'utils/errors';
import { getTransactionTimestamp } from 'utils/helpers';

import Button from 'components/ui/Button';
import Empty from 'components/ui/Empty';
import Hr from 'components/ui/Hr';
import Modal from 'components/ui/Modal';
import Spinner from 'components/ui/Spinner';
import CollectionView from './CollectionView';

type Props = {
  collectionMeta: { id: string; title: string };
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
  modalIsOpen: boolean;
};

const CollectionModal = ({
  collectionMeta,
  setModalIsOpen: setParentModalIsOpen,
  modalIsOpen: parentModalIsOpen,
}: Props) => {
  const [requestModalIsOpen, setRequestModalIsOpen] = useState(false);

  const queryClient = useQueryClient();
  const { account } = useAccountData();
  const { isLoading, data } = useQuery({
    queryKey: ['collection', collectionMeta.id],
    queryFn: () => getCollectionById(collectionMeta.id),
  });
  const { wallet } = useWallet();

  useEffect(() => {
    const prefetch = async () => {
      if (!data) {
        return;
      }

      await queryClient.prefetchQuery({
        queryKey: ['collection', data.id, 'files', data.fileIds],
        queryFn: () => getFilesByIds(data.fileIds),
      });
    };

    prefetch();
  }, [data, queryClient]);

  const closeHandler = () => {
    setParentModalIsOpen(false);
  };

  const isOwner = !!account?.collectionsOwned.includes(collectionMeta.id);

  const handleOwnershipRequest = async () => {
    if (!wallet?.passphrase) {
      toast.error('No passphrase defined');
      return;
    }

    const txAsset: RequestCollectionOwnershipAssetProps = {
      id: collectionMeta.id,
      timestamp: getTransactionTimestamp(),
    };

    try {
      await sendRequestCollectionOwnershipAsset(wallet.passphrase, txAsset);
      setParentModalIsOpen(false);
      setRequestModalIsOpen(false);
      toast.success('Ownership successfully requested!');
    } catch (err) {
      handleError(err);
      openParentModal();
    }
  };

  const openParentModal = () => {
    setParentModalIsOpen(true);
    setRequestModalIsOpen(false);
  };

  const openRequestModal = () => {
    setParentModalIsOpen(false);
    setRequestModalIsOpen(true);
  };

  return (
    <>
      <Modal title="Collection Details" isOpen={parentModalIsOpen} handleClose={closeHandler}>
        {isLoading && <Spinner />}
        {!isLoading && data && <CollectionView collection={data} setModalIsOpen={setParentModalIsOpen} />}
        {!isLoading && !data && <Empty />}

        <Hr className="my-4" />

        <div className="flex justify-center space-x-4">
          {isOwner && (
            <Link to={`/transfer/collection?defaultValue=${collectionMeta.id}`} className="text-black">
              <Button color="primary-bordered">Transfer</Button>
            </Link>
          )}

          {!isOwner && (
            <Button color="primary-bordered" onClick={openRequestModal}>
              Request Ownership
            </Button>
          )}

          <Button onClick={closeHandler}>Close</Button>
        </div>
      </Modal>
      <Modal title="Request ownership of Collection" isOpen={requestModalIsOpen} handleClose={openParentModal}>
        <div className="text-center mb-2">
          <p className="mb-8">
            You are about to request the ownership of <span className="font-bold">{collectionMeta.title}</span>.
            Continue?
          </p>
        </div>

        <div className="flex justify-center gap-8">
          <Button type="button" color="primary-bordered" onClick={openParentModal}>
            Cancel
          </Button>

          <Button type="button" onClick={handleOwnershipRequest}>
            Request
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CollectionModal;
