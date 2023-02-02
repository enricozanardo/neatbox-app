import Button from 'components/ui/Button';
import Modal from 'components/ui/Modal';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { sendRequestFileAccessPermissionAsset, sendRequestFileOwnershipAsset } from 'services/transactions';
import { useWalletStore } from 'stores/useWalletStore';
import { File, RequestFileAccessPermissionAssetProps, RequestFileOwnershipAssetProps } from 'types';
import { getTransactionTimestamp } from 'utils/helpers';

type Props = {
  file: File;
  isAllowed: boolean;
};

const FileRequests = ({ file, isAllowed }: Props) => {
  const [ownershipRequestIsOpen, setOwnershipRequestModalIsOpen] = useState(false);
  const [permissionRequestModalIsOpen, setPermissionRequestModalIsOpen] = useState(false);

  const wallet = useWalletStore(state => state.wallet);

  const handleOwnershipRequest = async () => {
    if (!wallet?.passphrase) {
      toast.error('No passphrase defined');
      return;
    }

    const txAsset: RequestFileOwnershipAssetProps = {
      id: file.data.id,
      timestamp: getTransactionTimestamp(),
    };

    try {
      await sendRequestFileOwnershipAsset(wallet.passphrase, txAsset);
      toast.success('Ownership successfully requested!');
    } catch (err) {
      // Todo: create proper error handler
      // @ts-ignore
      toast.error(err.message);
    }

    setOwnershipRequestModalIsOpen(false);
  };

  const handleAccessPermissionRequest = async () => {
    if (!wallet?.passphrase) {
      toast.error('No passphrase defined');
      return;
    }

    const txAsset: RequestFileAccessPermissionAssetProps = {
      id: file.data.id,
      timestamp: getTransactionTimestamp(),
    };

    try {
      await sendRequestFileAccessPermissionAsset(wallet.passphrase, txAsset);
      toast.success('Access Permission successfully requested!');
    } catch (err) {
      // Todo: create proper error handler
      // @ts-ignore
      toast.error(err.message);
    }

    setPermissionRequestModalIsOpen(false);
  };

  const renderButtons = () => (
    <div className="text-center flex justify-center my-8">
      <div className="flex gap-4">
        <Button size="sm" color="primary-bordered" onClick={() => setOwnershipRequestModalIsOpen(true)}>
          Request Ownership
        </Button>

        {!isAllowed && (
          <Button size="sm" color="primary-bordered" onClick={() => setPermissionRequestModalIsOpen(true)}>
            Request Access Permission
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {renderButtons()}

      <Modal
        title="Request ownership of file"
        isOpen={ownershipRequestIsOpen}
        handleClose={() => setOwnershipRequestModalIsOpen(false)}
      >
        <div className="text-center mb-2">
          <p className="mb-8">
            You are about to request the ownership of <span className="font-bold">{file.data.title}</span>. Continue?
          </p>
        </div>

        <div className="flex justify-center gap-8">
          <Button type="button" color="primary-bordered" onClick={() => setOwnershipRequestModalIsOpen(false)}>
            Cancel
          </Button>

          <Button type="button" onClick={handleOwnershipRequest}>
            Request
          </Button>
        </div>
      </Modal>

      <Modal
        title="Request download permission of file"
        isOpen={permissionRequestModalIsOpen}
        handleClose={() => setPermissionRequestModalIsOpen(false)}
      >
        <div className="mb-8 text-center">
          You are about to request download permission of <span className="font-bold">{file.data.title}</span>.
          Continue?
        </div>

        <div className="flex justify-center gap-8">
          <Button type="button" color="primary-bordered" onClick={() => setPermissionRequestModalIsOpen(false)}>
            Cancel
          </Button>

          <Button type="button" onClick={handleAccessPermissionRequest}>
            Request
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default FileRequests;
