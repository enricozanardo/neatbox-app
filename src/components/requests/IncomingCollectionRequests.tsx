import Empty from 'components/ui/Empty';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getFilesByIds, getPublicKeyFromTransaction } from 'services/api';
import { buildDamUrl, getAxios } from 'services/axios';
import { sendRespondToCollectionRequestAsset } from 'services/transactions';
import { useAccountStore } from 'stores/useAccountStore';
import { useWalletStore } from 'stores/useWalletStore';
import { Collection, CollectionRequest, RespondToCollectionRequestAssetProps } from 'types';
import { getTransactionTimestamp } from 'utils/helpers';

import { CollectionRequestItem } from './CollectionRequestItem';

type Props = {
  collections: Collection[];
};

const IncomingCollectionRequests = ({ collections }: Props) => {
  const wallet = useWalletStore(state => state.wallet);
  const { removeRequests, setIgnoreRefresh } = useAccountStore(state => ({
    removeRequests: state.removeRequests,
    setIgnoreRefresh: state.setIgnoreRefresh,
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [disableInteraction, setDisableInteraction] = useState(false);

  const navigate = useNavigate();

  const handleResponse = async (request: CollectionRequest, collection: Collection, accept: boolean) => {
    if (!wallet?.passphrase) {
      toast.error('No passphrase defined');
      return;
    }

    let updatedFileData: { fileId: string; newHash: string }[] = [];

    setIsLoading(true);

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

      await sendRespondToCollectionRequestAsset(wallet.passphrase, txAsset);

      /** Optimistically remove request from account's incoming requests */
      removeRequests([request.requestId]);

      toast.success(`Transfer request successfully ${accept ? 'accepted' : 'declined'}!`);

      if (accept) {
        navigate(`/collections?ref=${collectionId}`);
      } else {
        setIgnoreRefresh(true);
      }
    } catch (err) {
      // Todo: create proper error handler
      // @ts-ignore
      toast.error(err.message);
    }

    setIsLoading(false);
    setDisableInteraction(false);
  };

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
