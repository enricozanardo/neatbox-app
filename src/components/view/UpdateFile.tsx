import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

import Button from 'components/ui/Button';
import Icon from 'components/ui/Icon';
import Modal from 'components/ui/Modal';
import Toggle from 'components/ui/Toggle';
import CustomFields, { CustomField } from 'components/upload/CustomFields';
import useWallet from 'hooks/useWallet';
import { sendUpdateFileAsset } from 'services/transactions';
import { File, UpdateFileAssetProps } from 'types';
import { optimisticallyUpdateFile } from 'utils/cache';
import { handleError } from 'utils/errors';
import { bufferToJson, fileIsTimedTransfer, getTransactionTimestamp, jsonToBuffer } from 'utils/helpers';

type Props = {
  file: File;
};

const UpdateFile = ({ file }: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [transferFee, setTransferFee] = useState(file.data.transferFee);
  const [accessPermissionFee, setAccessPermissionFee] = useState(file.data.accessPermissionFee);
  const [isPrivate, setIsPrivate] = useState(file.data.private);
  const [customFields, setCustomFields] = useState<CustomField[]>(bufferToJson(file.data.customFields));

  const { wallet } = useWallet();
  const queryClient = useQueryClient();

  const updateFileMutation = useMutation({
    mutationFn: ({ passphrase, txAsset }: { passphrase: string; txAsset: UpdateFileAssetProps }) =>
      sendUpdateFileAsset(passphrase, txAsset),
    onSuccess: (_, { txAsset }) => {
      optimisticallyUpdateFile(queryClient, txAsset, isPrivate, customFields);
      toast.success('File updated!');
    },
    onError: handleError,
    onSettled: () => setModalIsOpen(false),
  });

  const handleUpdateFile = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!wallet?.passphrase) {
      toast.error('No passphrase defined');
      return;
    }

    if (transferFee < 1 || accessPermissionFee < 1) {
      toast.error('Fee must be at least 1');
      return;
    }

    const txAsset: UpdateFileAssetProps = {
      fileId: file.data.id,
      transferFee,
      accessPermissionFee,
      private: isPrivate,
      customFields: jsonToBuffer(customFields),
      timestamp: getTransactionTimestamp(),
    };

    updateFileMutation.mutate({ passphrase: wallet.passphrase, txAsset });
  };

  return (
    <>
      <div className="text-gray-400 cursor-pointer" onClick={() => setModalIsOpen(true)}>
        <Icon type="faEdit" />
      </div>

      <Modal title="Update File" isOpen={modalIsOpen} handleClose={() => setModalIsOpen(false)}>
        <form onSubmit={handleUpdateFile}>
          <div className="flex gap-8 justify-center mb-8">
            <div className="w-full max-w-md flex flex-col gap-4">
              <label className="block ">
                <span className="label">New Transfer Fee</span>
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

              <label className="block">
                <span className="label">New Access Permission Fee</span>
                <div>
                  <input
                    min={1}
                    id="access-input"
                    type="number"
                    value={accessPermissionFee}
                    onChange={e => setAccessPermissionFee(Number(e.target.value))}
                    className="base-input mb-1 block"
                    disabled={fileIsTimedTransfer(file)}
                  />
                </div>
              </label>

              <label className="block w-1/2">
                <span className="label">Private</span>
                <div className="mt-1">
                  <Toggle isChecked={isPrivate} onCheck={() => setIsPrivate(!isPrivate)} />
                </div>
              </label>

              <CustomFields customFields={customFields} setCustomFields={setCustomFields} isUpdate />
            </div>
          </div>

          <div className="flex justify-center gap-8">
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

export default UpdateFile;
