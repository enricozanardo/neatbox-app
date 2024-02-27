import AddressInput, { ADDRESS_RESULT_INIT } from 'components/ui/AddressInput';
import Button from 'components/ui/Button';
import Label from 'components/ui/Label';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { sendRequestFileTransferAsset } from 'services/transactions';
import { File, RequestFileTransferAssetProps, Wallet } from 'types';
import { handleError } from 'utils/errors';
import { accountHasEnoughBalance, getTransactionTimestamp } from 'utils/helpers';

type Props = {
  files: File[];
  defaultValue: string | null;
  wallet: Wallet | null;
  isAuthenticated: boolean;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
};

const TransferFileForm = ({ files, defaultValue, wallet, isAuthenticated, setSuccess }: Props) => {
  const [selectedFileId, setSelectedFileId] = useState(defaultValue || '');
  const [selectedFileData, setSelectedFileData] = useState<File | null>(null);
  const [addressResult, setAddressResult] = useState(ADDRESS_RESULT_INIT);

  useEffect(() => {
    const file = files.find(a => a.data.id === defaultValue);

    if (file) {
      setSelectedFileData(file);
    }
  }, [files, defaultValue]);

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const recipient = addressResult.account;

    if (!recipient) {
      return;
    }

    if (!selectedFileData) {
      return;
    }

    if (!accountHasEnoughBalance(selectedFileData.data.transferFee, recipient.token.balance)) {
      toast.error('Recipient has insufficient balance');
      return;
    }

    try {
      const asset: RequestFileTransferAssetProps = {
        fileId: selectedFileData.data.id,
        recipientAddress: recipient.address,
        timestamp: getTransactionTimestamp(),
      };

      await sendRequestFileTransferAsset(wallet!.passphrase, asset);
      toast.success('File transfer initiated!');
      setSuccess(true);
    } catch (err) {
      handleError(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const file = files.find(a => a.data.id === id);

    if (!file) {
      return;
    }

    setSelectedFileId(file.data.id);
    setSelectedFileData(file);
  };

  return (
    <form onSubmit={onSubmit} className="w-full">
      <label className="block mb-8 md:mb-10 lg:mb-12">
        <Label text="File" />
        <select className="base-input" value={selectedFileId} onChange={handleChange}>
          <option value=""></option>
          {files.map(a => (
            <option value={a.data.id} key={a.data.id}>
              {a.data.title}
            </option>
          ))}
        </select>
      </label>

      <AddressInput setAddressResult={setAddressResult} />

      <div className="text-center mt-16">
        <Button size="lg" type="submit" disabled={!!!addressResult.account || !selectedFileId}>
          Request Transfer
        </Button>

        <p className="text-sm mt-4 text-gray-400">
          {/* <Icon type="faLock" /> {wallet && isAuthenticated && <span>Transferring an file requires 25 tokens</span>}{' '} */}
          {!isAuthenticated && <span>Please log in to transfer a file</span>}
          {!wallet && <span>Please create or import a wallet to transfer a file</span>}
        </p>
      </div>
    </form>
  );
};

export default TransferFileForm;
