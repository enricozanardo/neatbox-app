import { useMutation, useQueryClient } from '@tanstack/react-query';
import Empty from 'components/ui/Empty';
import useAccountData from 'hooks/useAccountData';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getFilesByIds, getPublicKeyFromTransaction } from 'services/api';
import { buildDamUrl, getAxios } from 'services/axios';
import { sendRespondToCollectionRequestAsset } from 'services/transactions';
import { useWalletStore } from 'stores/useWalletStore';
import { Collection, CollectionRequest, RespondToCollectionRequestAssetProps } from 'types';
import { optimisticallyAddCollection } from 'utils/cache';
import { hexToBuffer } from 'utils/crypto';
import { handleError } from 'utils/errors';
import { getTransactionTimestamp } from 'utils/helpers';

import { CollectionRequestItem } from './CollectionRequestItem';

type Props = {
  collections: Collection[];
};

const IncomingCollectionRequests = ({ collections }: Props) => {
  const [disableInteraction, setDisableInteraction] = useState(false);
  const [damIsProcessing, setDamIsProcessing] = useState(false);

  const wallet = useWalletStore(state => state.wallet);
  const { removeRequests } = useAccountData();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleResponse = async (request: CollectionRequest, collection: Collection, accept: boolean) => {
    if (!wallet?.passphrase) {
      toast.error('No passphrase defined');
      return;
    }

    let updatedFileData: { fileId: string; newHash: string }[] = [];

    const { collectionId, requestId } = request;

    try {
      /** if accepted, make a request to retrieve, decrypt and re-encrypt the file on the DAM server */
      if (accept) {
        setDisableInteraction(true);

        const requesterPublicKey = await getPublicKeyFromTransaction(requestId);
        const responderPublicKey = wallet.publicKey;

        const formData = new FormData();

        formData.append('password', requesterPublicKey);
        formData.append('newPassword', responderPublicKey);

        const { files } = await getFilesByIds(collection.fileIds);
        const fileData = files.map(file => ({ fileId: file.data.id, encryptedHash: file.data.hash }));

        formData.append('fileData', JSON.stringify(fileData));

        /** let the DAM transfer all files and utilize new hashes in tx */
        setDamIsProcessing(true);
        const response: { updatedFileData: { fileId: string; newHash: string }[] } = await getAxios()
          .post(buildDamUrl('transfer-collection'), formData)
          .then(res => res.data);

        updatedFileData = response.updatedFileData;
        setDamIsProcessing(false);

        /** validate if DAM processed all files */
        files.forEach(f => {
          const updatedFile = updatedFileData.find(u => u.fileId === f.data.id);

          if (!updatedFile) {
            throw new Error(`File ${f.data.id} not found in DAM response`);
          }

          /** TODO: Check more than just = equal */
          if (updatedFile.newHash === f.data.hash) {
            throw new Error(`New hash for ${f.data.id} is invalid`);
          }
        });
      }

      const txAsset: RespondToCollectionRequestAssetProps = {
        collectionId,
        requestId,
        accept,
        updatedFileData,
        timestamp: getTransactionTimestamp(),
      };

      mutate({ passphrase: wallet.passphrase, txAsset, request, accept, collection });
    } catch (err) {
      handleError(err);
      setDamIsProcessing(false);
    }
  };

  const { isLoading, mutate } = useMutation({
    mutationFn: ({
      passphrase,
      txAsset,
    }: {
      passphrase: string;
      txAsset: RespondToCollectionRequestAssetProps;
      request: CollectionRequest;
      accept: boolean;
      collection: Collection;
    }) => sendRespondToCollectionRequestAsset(passphrase, txAsset),
    onSuccess: (_, { request, accept, collection }) => {
      removeRequests([request.requestId]);
      toast.success('Request successfully processed');

      if (accept) {
        optimisticallyAddCollection(
          queryClient,
          ['account', 'collectionsOwned'],
          collection.id,
          hexToBuffer(wallet!.binaryAddress),
          { title: collection.title, fileIds: collection.fileIds, transferFee: collection.transferFee },
        );
        navigate(`/collections?ref=${collection.id}`);
      }
    },
    onError: handleError,
    onSettled: () => {
      setDisableInteraction(false);
    },
  });

  return (
    <section>
      <h2 className="text-center mt-16 mb-4">Collection Requests</h2>

      {collections.length === 0 && <Empty />}

      {collections.map((c, i) => (
        <div className="mb-8 space-y-8" key={`${c.id}-${i}`}>
          {c.requests.map(r => (
            <CollectionRequestItem
              key={r.requestId}
              request={r}
              collection={c}
              handleResponse={handleResponse}
              isLoading={isLoading || damIsProcessing}
              disableInteraction={disableInteraction}
            />
          ))}
        </div>
      ))}
    </section>
  );
};

export default IncomingCollectionRequests;
