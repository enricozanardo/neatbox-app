import { useMutation } from '@tanstack/react-query';
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
import { handleError } from 'utils/errors';
import { getTransactionTimestamp } from 'utils/helpers';

import { CollectionRequestItem } from './CollectionRequestItem';

type Props = {
  collections: Collection[];
};

const IncomingCollectionRequests = ({ collections }: Props) => {
  const wallet = useWalletStore(state => state.wallet);
  const { removeRequests } = useAccountData();
  const [disableInteraction, setDisableInteraction] = useState(false);

  const navigate = useNavigate();

  const handleResponse = async (request: CollectionRequest, collection: Collection, accept: boolean) => {
    if (!wallet?.passphrase) {
      toast.error('No passphrase defined');
      return;
    }

    let updatedFileData: { fileId: string; newHash: string }[] = [];

    const { collectionId, requestId } = request;

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
      const response: { updatedFileData: { fileId: string; newHash: string }[] } = await getAxios()
        .post(buildDamUrl('transfer-collection'), formData)
        .then(res => res.data);

      updatedFileData = response.updatedFileData;

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

    mutate({ passphrase: wallet.passphrase, txAsset, request, accept });
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
    }) => sendRespondToCollectionRequestAsset(passphrase, txAsset),
    onSuccess: (_, { request, accept }) => {
      removeRequests([request.requestId]);
      toast.success('Request successfully processed');

      if (accept) {
        navigate(`/collections?ref=${request.collectionId}`);
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
              isLoading={isLoading}
              disableInteraction={disableInteraction}
            />
          ))}
        </div>
      ))}
    </section>
  );
};

export default IncomingCollectionRequests;
