import Empty from 'components/ui/Empty';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getFileById, getPublicKeyFromTransaction } from 'services/api';
import { buildDamUrl, getAxios } from 'services/axios';
import { sendRespondToFileRequestAsset } from 'services/transactions';
import { useAccountStore } from 'stores/useAccountStore';
import { useWalletStore } from 'stores/useWalletStore';
import { File, FileRequest, FileRequestType, RespondToFileRequestAssetProps } from 'types';
import { getTransactionTimestamp, prepareFileRequests } from 'utils/helpers';

import { FileRequestItem } from './FileRequestItem';

type Props = {
  files: File[];
};

export const requestTypeMap = {
  [FileRequestType.Ownership]: 'Ownership',
  [FileRequestType.AccessPermission]: 'Access (download) permission',
  [FileRequestType.Transfer]: 'Transfer',
  [FileRequestType.TimedTransfer]: 'Timed Transfer',
};

const IncomingFileRequests = ({ files }: Props) => {
  const wallet = useWalletStore(state => state.wallet);
  const { removeRequests, account, setIgnoreRefresh } = useAccountStore(state => ({
    removeRequests: state.removeRequests,
    account: state.account,
    setIgnoreRefresh: state.setIgnoreRefresh,
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [disableInteraction, setDisableInteraction] = useState(false);
  const navigate = useNavigate();

  const handleResponse = async (request: FileRequest, accept: boolean) => {
    if (!wallet?.passphrase) {
      toast.error('No passphrase defined');
      return;
    }

    setIsLoading(true);

    const { fileId, requestId, type } = request;

    try {
      let newHash = '';

      /** if accepted, make a request to retrieve, decrypt and re-encrypt the file on the DAM server */
      if (
        accept &&
        (type === FileRequestType.Transfer ||
          type === FileRequestType.Ownership ||
          type === FileRequestType.TimedTransfer)
      ) {
        setDisableInteraction(true);
        const file = await getFileById(fileId);

        const requesterPublicKey = await getPublicKeyFromTransaction(requestId);
        const responderPublicKey = wallet.publicKey;

        const formData = new FormData();
        formData.append('encryptedHash', file.data.hash);

        const requesterIsOldOwner = type === FileRequestType.Transfer || type === FileRequestType.TimedTransfer;
        formData.append('password', requesterIsOldOwner ? requesterPublicKey : responderPublicKey);
        formData.append('newPassword', requesterIsOldOwner ? responderPublicKey : requesterPublicKey);

        const { encryptedHash }: { encryptedHash: string } = await getAxios()
          .post(buildDamUrl('transfer-file'), formData)
          .then(res => res.data);

        newHash = encryptedHash;
      }

      const txAsset: RespondToFileRequestAssetProps = {
        fileId,
        requestId,
        accept,
        newHash,
        timestamp: getTransactionTimestamp(),
      };

      await sendRespondToFileRequestAsset(wallet.passphrase, txAsset);

      const requestsToRemove =
        (request.type === FileRequestType.Transfer || request.type === FileRequestType.Ownership) && account && accept
          ? account.storage.incomingFileRequests.filter(r => r.fileId === fileId).map(r => r.requestId)
          : [request.requestId];

      removeRequests(requestsToRemove);

      toast.success(`${requestTypeMap[type]} request successfully ${accept ? 'accepted' : 'declined'}!`);

      if (accept && (request.type === FileRequestType.Transfer || request.type === FileRequestType.TimedTransfer)) {
        navigate(`/dashboard?ref=${fileId}`);
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

  if (!account) {
    return null;
  }

  const requests = prepareFileRequests(files, account.storage.incomingFileRequests);

  return (
    <section>
      <h2 className="text-center mb-4">File Requests</h2>

      {requests.length === 0 && <Empty />}

      <div className="mb-8 space-y-8">
        {requests.map(({ file, request }) => (
          <FileRequestItem
            key={request.requestId}
            request={request}
            asset={file}
            handleResponse={handleResponse}
            isLoading={isLoading}
            disableInteraction={disableInteraction}
          />
        ))}
      </div>
    </section>
  );
};

export default IncomingFileRequests;
