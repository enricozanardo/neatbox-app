import AddressInput, { ADDRESS_RESULT_INIT } from 'components/ui/AddressInput';
import Button from 'components/ui/Button';
import Label from 'components/ui/Label';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { sendRequestCollectionTransferAsset } from 'services/transactions';
import { Collection, RequestCollectionTransferAssetProps, Wallet } from 'types';
import { handleError } from 'utils/errors';
import { accountHasEnoughBalance, getTransactionTimestamp } from 'utils/helpers';

type Props = {
  collections: Collection[];
  defaultValue: string | null;
  wallet: Wallet | null;
  isAuthenticated: boolean;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
};

const TransferCollectionForm = ({ collections, defaultValue, wallet, isAuthenticated, setSuccess }: Props) => {
  const [selectedCollectionId, setSelectedCollectionId] = useState(defaultValue || '');
  const [selectedCollectionData, setSelectedCollectionData] = useState<Collection | null>(null);
  const [addressResult, setAddressResult] = useState(ADDRESS_RESULT_INIT);

  useEffect(() => {
    const collection = collections.find(c => c.id === defaultValue);

    if (collection) {
      setSelectedCollectionData(collection);
    }
  }, [collections, defaultValue]);

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const recipient = addressResult.account;

    if (!recipient) {
      return;
    }

    if (!selectedCollectionData) {
      return;
    }

    if (!accountHasEnoughBalance(selectedCollectionData.transferFee, recipient.token.balance)) {
      toast.error('Recipient has insufficient balance');
      return;
    }

    try {
      const asset: RequestCollectionTransferAssetProps = {
        collectionId: selectedCollectionData.id,
        recipientAddress: recipient.address,
        timestamp: getTransactionTimestamp(),
      };

      await sendRequestCollectionTransferAsset(wallet!.passphrase, asset);
      toast.success('Collection transfer initiated!');
      setSuccess(true);
    } catch (err) {
      handleError(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const collection = collections.find(c => c.id === id);

    if (!collection) {
      return;
    }

    setSelectedCollectionId(collection.id);
    setSelectedCollectionData(collection);
  };

  return (
    <form onSubmit={onSubmit} className="w-full">
      <label className="block mb-8 md:mb-10 lg:mb-12">
        <Label text="Collection" />
        <select className="base-input" value={selectedCollectionId} onChange={handleChange}>
          <option value=""></option>
          {collections.map(c => (
            <option value={c.id} key={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </label>

      <AddressInput setAddressResult={setAddressResult} />

      <div className="text-center mt-16">
        <Button size="lg" type="submit" disabled={!!!addressResult.account || !selectedCollectionId}>
          Request Transfer
        </Button>

        <p className="text-sm mt-4 text-gray-400">
          {/* <Icon type="faLock" /> {wallet && isAuthenticated && <span>Transferring an collection requires 25 tokens</span>}{' '} */}
          {!isAuthenticated && <span>Please log in to transfer a collection</span>}
          {!wallet && <span>Please create or import a wallet to transfer a collection</span>}
        </p>
      </div>
    </form>
  );
};

export default TransferCollectionForm;
