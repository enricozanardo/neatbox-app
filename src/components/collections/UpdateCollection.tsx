import { useMutation } from '@tanstack/react-query';
import Button from 'components/ui/Button';
import Modal from 'components/ui/Modal';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { sendUpdateCollectionAsset } from 'services/transactions';
import { useWalletStore } from 'stores/useWalletStore';
import { Collection, File, UpdateCollectionAssetProps } from 'types';
import { handleError } from 'utils/errors';
import { getTransactionTimestamp } from 'utils/helpers';

import { FileCheckBox } from './FileCheckBox';

const DEFAULT_FEE = 100;

type Props = {
  collection: Collection;
  ownedFiles: File[];
  optimisticallyUpdateCollection: (asset: UpdateCollectionAssetProps) => void;
  optimisticallyUpdateFileCollection: (fileIds: string[], collection: Collection) => void;
};

const UpdateCollection = ({
  collection,
  ownedFiles,
  optimisticallyUpdateCollection,
  optimisticallyUpdateFileCollection,
}: Props) => {
  const wallet = useWalletStore(state => state.wallet);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [title, setTitle] = useState(collection.title);
  const [transferFee, setTransferFee] = useState(collection.transferFee);
  const [updatedCollectionFileIds, setUpdatedCollectionFileIds] = useState(collection.fileIds);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!wallet) {
      return;
    }

    if (transferFee < 1) {
      toast.error('Fee must be at least 1');
      return;
    }

    const asset: UpdateCollectionAssetProps = {
      collectionId: collection.id,
      transferFee,
      fileIds: updatedCollectionFileIds,
      timestamp: getTransactionTimestamp(),
    };

    mutate({ passphrase: wallet.passphrase, asset });
  };

  const { mutate } = useMutation({
    mutationFn: ({ passphrase, asset }: { passphrase: string; asset: UpdateCollectionAssetProps }) =>
      sendUpdateCollectionAsset(passphrase, asset),
    onSuccess: (_, { asset }) => {
      toast.success('Collection updated!');
      optimisticallyUpdateCollection(asset);
      optimisticallyUpdateFileCollection(asset.fileIds, collection);
    },
    onError: handleError,
    onSettled: () => {
      setModalIsOpen(false);
      setTitle('');
      setTransferFee(DEFAULT_FEE);
    },
  });

  const handleCheck = (id: string, checked: boolean) => {
    if (checked) {
      setUpdatedCollectionFileIds(prevState => [...prevState, id]);
    }

    if (!checked) {
      setUpdatedCollectionFileIds(prevState => prevState.filter(f => f !== id));
    }
  };
  const availableFiles = ownedFiles.filter(
    f => (f.meta.collection.id === '' || f.meta.collection.id === collection.id) && !f.meta.expiration.unix,
  );

  return (
    <>
      <div className="text-center">
        <Button link onClick={() => setModalIsOpen(true)}>
          Update
        </Button>
      </div>

      <Modal title="Update Collection" isOpen={modalIsOpen} handleClose={() => setModalIsOpen(false)}>
        <form onSubmit={handleSubmit}>
          <div className="flex  gap-8 justify-center mb-8">
            <div className="w-full max-w-md">
              <label className="block">
                <span className="label">Title</span>
                <input
                  placeholder="Enter a title"
                  value={title}
                  disabled
                  onChange={e => setTitle(e.target.value)}
                  type="text"
                  className="base-input"
                  required
                />
              </label>
            </div>
            <label className="block w-1/2">
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

          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="text-center">
                <span className="label">Available Files*</span>

                {ownedFiles.length === 0 && (
                  <div className="text-gray-400 mt-4 text-sm">
                    No files found in account :(
                    <div className="block">
                      <Link to="/upload">Start uploading</Link>
                    </div>
                  </div>
                )}

                {ownedFiles.length > 0 && availableFiles.length === 0 && (
                  <div className="text-gray-400 mt-4 text-sm">
                    All of your files are already part of other collections :(
                  </div>
                )}
              </div>

              {availableFiles.map(f => (
                <FileCheckBox
                  key={f.data.id}
                  checked={updatedCollectionFileIds.includes(f.data.id)}
                  file={f}
                  handleCheck={handleCheck}
                />
              ))}
            </div>
          </div>

          <span className="block text-xs text-center text-gray-500 mt-4 mb-8">
            *You can only add files that are not part of any other collection
            <br />
            **Download permissions for other users will be removed when a file is added to a collection
          </span>

          <div className="flex justify-center gap-4 mt-8 ">
            <Button type="button" color="primary-bordered" onClick={() => setModalIsOpen(false)}>
              Cancel
            </Button>

            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default UpdateCollection;
