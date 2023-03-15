import { useMutation } from '@tanstack/react-query';
import Empty from 'components/ui/Empty';
import Unauthorized from 'components/ui/Unauthorized';
import useAccountData from 'hooks/useAccountData';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getFileById, getPublicKeyFromTransaction } from 'services/api';
import { buildDamUrl, getAxios } from 'services/axios';
import { sendRespondToFileRequestAsset } from 'services/transactions';
import { useWalletStore } from 'stores/useWalletStore';
import { File, FileRequest, FileRequestType, RespondToFileRequestAssetProps } from 'types';
import { handleError } from 'utils/errors';
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
  const [disableInteraction, setDisableInteraction] = useState(false);
  const [damIsProcessing, setDamIsProcessing] = useState(false);

  const wallet = useWalletStore(state => state.wallet);
  const { removeRequests, account } = useAccountData();
  const navigate = useNavigate();

  const handleResponse = async (request: FileRequest, accept: boolean) => {
    if (!wallet?.passphrase) {
      toast.error('No passphrase defined');
      return;
    }

    const { fileId, requestId, type } = request;

    let newHash = '';

    const includesFileProcessing =
      accept &&
      (type === FileRequestType.Transfer ||
        type === FileRequestType.Ownership ||
        type === FileRequestType.TimedTransfer);

    try {
      /** if accepted, make a request to retrieve, decrypt and re-encrypt the file on the DAM server */
      if (includesFileProcessing) {
        setDisableInteraction(true);

        const file = await getFileById(fileId);

        const requesterPublicKey = await getPublicKeyFromTransaction(requestId);
        const responderPublicKey = wallet.publicKey;

        const formData = new FormData();
        formData.append('encryptedHash', file.data.hash);

        const requesterIsOldOwner = type === FileRequestType.Transfer || type === FileRequestType.TimedTransfer;
        formData.append('password', requesterIsOldOwner ? requesterPublicKey : responderPublicKey);
        formData.append('newPassword', requesterIsOldOwner ? responderPublicKey : requesterPublicKey);

        setDamIsProcessing(true);
        const { encryptedHash }: { encryptedHash: string } = await getAxios()
          .post(buildDamUrl('transfer-file'), formData)
          .then(res => res.data);
        setDamIsProcessing(false);

        newHash = encryptedHash;
      }

      const txAsset: RespondToFileRequestAssetProps = {
        fileId,
        requestId,
        accept,
        newHash,
        timestamp: getTransactionTimestamp(),
      };

      mutate({ passphrase: wallet.passphrase, txAsset, request, accept });
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
      txAsset: RespondToFileRequestAssetProps;
      request: FileRequest;
      accept: boolean;
    }) => sendRespondToFileRequestAsset(passphrase, txAsset),
    onSuccess: (_, { request, txAsset, accept }) => {
      const ids =
        (request.type === FileRequestType.Transfer || request.type === FileRequestType.Ownership) && account && accept
          ? account.storage.incomingFileRequests.filter(r => r.fileId === txAsset.fileId).map(r => r.requestId)
          : [request.requestId];

      removeRequests(ids);
      toast.success('Request successfully processed');

      if (accept) {
        if (request.type === FileRequestType.Transfer || request.type === FileRequestType.TimedTransfer) {
          navigate(`/dashboard?ref=${txAsset.fileId}`);
        }
      } else {
        toast('Request successfully declined', { icon: 'ℹ️ ' });
      }
    },
    onError: handleError,
    onSettled: () => {
      setDisableInteraction(false);
    },
  });

  if (!account) {
    return <Unauthorized />;
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
            isLoading={isLoading || damIsProcessing}
            disableInteraction={disableInteraction}
          />
        ))}
      </div>
    </section>
  );
};

export default IncomingFileRequests;
