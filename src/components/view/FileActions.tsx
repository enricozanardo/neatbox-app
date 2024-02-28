import fileDownload from 'js-file-download';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import Button from 'components/ui/Button';
import Spinner from 'components/ui/Spinner';
import useWallet from 'hooks/useWallet';
import { fetchTx, getPublicKeyFromTransaction } from 'services/api';
import { buildDamUrl, getAxios, handleLoadingProgress } from 'services/axios';
import { File, HistoryItemType, RespondToFileRequestAssetProps } from 'types';
import { handleError } from 'utils/errors';
import { fileIsPArtOfCollection } from 'utils/helpers';

type Props = {
  file: File;
  isOwner: boolean;
  isAllowed: boolean;
  isTransferrable: boolean;
};

const FileActions = ({ file, isOwner, isAllowed, isTransferrable }: Props) => {
  const { wallet } = useWallet();
  const [isDownloading, setIsDownloading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const isPartOfCollection = fileIsPArtOfCollection(file);

  const handleFileDownload = async () => {
    if (!file || !wallet) {
      return;
    }

    setLoadingProgress(0);
    setIsDownloading(true);

    const formData = new FormData();
    formData.append('encryptedHash', file.data.hash);

    if (isOwner) {
      formData.append('password', wallet.publicKey);
    }

    if (!isOwner && isAllowed) {
      /** retrieve public key from most recent owner */
      const transfers = file.data.history.filter(item => item.activity === HistoryItemType.Transfer);

      /** item has never been transferred - look up registration for details */
      if (transfers.length === 0) {
        const registration = file.data.history.find(item => item.activity === HistoryItemType.Registration);

        if (!registration) {
          console.error('Could not retrieve required details');
          setIsDownloading(false);
          return;
        }

        formData.append('password', await getPublicKeyFromTransaction(registration.id));
      }

      /** item has been transferred in past - trace back history to retrieve details */
      if (transfers.length > 0) {
        const lastTransfer = transfers.pop();

        if (!lastTransfer) {
          console.error('Could not retrieve required details');
          setIsDownloading(false);
          return;
        }

        const responseTx = await fetchTx<RespondToFileRequestAssetProps>(lastTransfer.id);
        const requestTx = await fetchTx(responseTx.asset.requestId);

        /** assetID 2 = ownership request, assetID 3 = access permission request */
        if (requestTx.assetID === 2 || requestTx.assetID === 3) {
          formData.append('password', requestTx.senderPublicKey.toString('hex'));
        }

        /** assetID 4 = transfer request */
        if (requestTx.assetID === 4) {
          formData.append('password', responseTx.senderPublicKey.toString('hex'));
        }
      }
    }

    try {
      const { data } = await getAxios().post(buildDamUrl('download'), formData, {
        responseType: 'arraybuffer',
        onDownloadProgress: e => handleLoadingProgress(e, setLoadingProgress),
      });

      const blob = new Blob([data], { type: file.data.type });
      fileDownload(blob, file.data.name);
    } catch (err) {
      handleError(err);
    }

    setIsDownloading(false);
  };

  if (isDownloading) {
    return (
      <div className="text-center h-7">
        <span className="text-secondary-500 mr-2">
          <Spinner />
        </span>
        <span className="font-bold">{loadingProgress} %</span>

        <span className="text-xs text-gray-400 block">
          {loadingProgress === 0 ? 'Processing...' : 'Downloading...'}
        </span>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-4">
      {isTransferrable && !isPartOfCollection && (
        <Link to={`/transfer/file?defaultValue=${file.data.id}`} className="text-black">
          <Button color="primary-bordered">Transfer</Button>
        </Link>
      )}

      <Button onClick={handleFileDownload} disabled={!(isAllowed || isOwner)}>
        Download
      </Button>
    </div>
  );
};

export default FileActions;
