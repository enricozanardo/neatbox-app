import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'react-hot-toast';
import { sendRequestCollectionOwnershipAsset } from 'services/transactions';
import useWallet from 'hooks/useWallet';
import { RequestCollectionOwnershipAssetProps } from 'types';
import { handleError } from 'utils/errors';
import { getTransactionTimestamp } from 'utils/helpers';

import Button from '../Button';
import Modal from '../Modal';

type Props = {
  collectionMeta: { id: string; title: string };
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
};

const RequestOwnership = ({ collectionMeta, setModalIsOpen: setParentModalIsOpen }: Props) => {
  const [requestModalIsOpen, setRequestModalIsOpen] = useState(false);

  const { wallet } = useWallet();

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
      toast.success('Ownership successfully requested!');
    } catch (err) {
      handleError(err);
    }

    openParentModal();
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
      <Button color="primary-bordered" onClick={openRequestModal}>
        Request Ownership
      </Button>

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

export default RequestOwnership;
