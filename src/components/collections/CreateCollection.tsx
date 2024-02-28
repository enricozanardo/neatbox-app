import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

import Button from 'components/ui/Button';
import Icon from 'components/ui/Icon';
import Modal from 'components/ui/Modal';
import useWallet from 'hooks/useWallet';
import { sendCreateCollectionAsset, TX_FEES } from 'services/transactions';
import { CreateCollectionAssetProps } from 'types';
import { optimisticallyAddCollection } from 'utils/cache';
import { handleError } from 'utils/errors';
import { beddowsToLsk } from 'utils/formatting';
import { getTransactionTimestamp } from 'utils/helpers';

type Props = {
  accountHasCollections: boolean;
};

const DEFAULT_FEE = 100;

const CreateCollection = ({ accountHasCollections }: Props) => {
  const { wallet } = useWallet();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [transferFee, setTransferFee] = useState(DEFAULT_FEE);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!wallet) {
      return;
    }

    if (transferFee < 1) {
      toast.error('Fee must be at least 1');
      return;
    }

    const asset: CreateCollectionAssetProps = {
      title: title.trim(),
      transferFee,
      timestamp: getTransactionTimestamp(),
      fileIds: [],
    };

    mutate({ passphrase: wallet.passphrase, asset });
  };

  const { mutate } = useMutation({
    mutationFn: ({ passphrase, asset }: { passphrase: string; asset: CreateCollectionAssetProps }) =>
      sendCreateCollectionAsset(passphrase, asset),
    onSuccess: ({ transactionId }, { asset }) => {
      toast.success('Collection created!');
      optimisticallyAddCollection(queryClient, ['account', 'collectionsOwned'], transactionId, wallet!.lsk32address, {
        title: asset.title,
        transferFee: asset.transferFee,
        fileIds: [],
      });
    },
    onError: handleError,
    onSettled: () => {
      setTitle('');
      setTransferFee(DEFAULT_FEE);
      setModalIsOpen(false);
    },
  });

  return (
    <>
      <div className="text-center mt-8">
        {!accountHasCollections ? (
          <Button size={'lg'} onClick={() => setModalIsOpen(true)}>
            Create First Collection
          </Button>
        ) : (
          <Button color="primary-bordered" onClick={() => setModalIsOpen(true)}>
            Create New Collection
          </Button>
        )}
      </div>

      <Modal title="Create Collection" isOpen={modalIsOpen} handleClose={() => setModalIsOpen(false)}>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4 md:gap-6 lg:gap-8 justify-center mb-8">
            <div className="w-full max-w-md">
              <label className="block">
                <span className="label">Title</span>
                <input
                  placeholder="Enter a title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  type="text"
                  className="base-input"
                  required
                />
              </label>
            </div>

            <label className="block ">
              <span className="label">Transfer Fee</span>
              <div>
                <input
                  min={1}
                  id="transfer-input"
                  type="number"
                  value={transferFee}
                  onChange={e => setTransferFee(Number(e.target.value))}
                  className="base-input mb-1 block"
                />
              </div>
            </label>
          </div>

          <div className="flex justify-center gap-4">
            <Button type="button" color="primary-bordered" onClick={() => setModalIsOpen(false)}>
              Cancel
            </Button>

            <Button type="submit">Submit</Button>
          </div>
        </form>

        <p className="text-sm mt-4 text-gray-400 text-center">
          <Icon type="faLock" /> Creating a collection requires {beddowsToLsk(TX_FEES.createCollection)} tokens
        </p>
      </Modal>
    </>
  );
};

export default CreateCollection;
