import { useAuth0 } from '@auth0/auth0-react';
import Empty from 'components/ui/Empty';
import PageTitle from 'components/ui/PageTitle';
import SEO from 'components/ui/SEO';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchTx, getFileById, getPublicKeyFromTransaction } from 'services/api';
import { buildDamUrl, getAxios, handleLoadingProgress } from 'services/axios';
import { useAccountStore } from 'stores/useAccountStore';
import { useWalletStore } from 'stores/useWalletStore';
import { File, HistoryItemType, RespondToFileRequestAssetProps } from 'types';
import { bufferToHex } from 'utils/crypto';
import { devLog, fileIsTimedTransfer } from 'utils/helpers';

import FileDetails from './FileDetails';
import FileHistory from './FileHistory';
import FileRequests from './FileRequests';

type Props = {
  id: string;
};

const View = ({ id }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const wallet = useWalletStore(state => state.wallet);
  const account = useAccountStore(state => state.account);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFileById(id);
      setFile(data);
      devLog(data.data);
    };
    fetchData();
  }, [id]);

  const handleFileDownload = async () => {
    if (!file || !wallet) {
      return;
    }

    setLoadingProgress(0);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('encryptedHash', file.data.hash);

    if (isOwner) {
      formData.append('password', wallet.publicKey);
    }

    // TODO: delete 'allowed' if owner changes
    if (!isOwner && isAllowed) {
      /** retrieve public key from most recent owner */
      const transfers = file.data.history.filter(item => item.activity === HistoryItemType.Transfer);

      /** item has never been transferred - look up registration for details */
      if (transfers.length === 0) {
        const registration = file.data.history.find(item => item.activity === HistoryItemType.Registration);

        if (!registration) {
          console.error('Could not retrieve required details');
          setIsLoading(false);
          return;
        }

        formData.append('password', await getPublicKeyFromTransaction(registration.id));
      }

      /** item has been transferred in past - trace back history to retrieve details */
      if (transfers.length > 0) {
        const lastTransfer = transfers.pop();

        if (!lastTransfer) {
          console.error('Could not retrieve required details');
          setIsLoading(false);
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
      // Todo: create proper error handler
      const error = err as any;
      let msg = error.message;

      toast.error(msg);
      console.error(err);
    }

    setIsLoading(false);
  };

  const handleOptimisticUpdate = (updatedData: Partial<File>) => {
    if (!file) {
      return;
    }

    setFile({ ...file, ...updatedData });
  };

  const isOwner = !!(isAuthenticated && file && bufferToHex(file.data.owner) === wallet?.binaryAddress);
  const isAllowed = !!account?.storage.filesAllowed.includes(id);

  return (
    <div>
      <SEO pageTitle={file?.data.title ?? 'View'} />

      <PageTitle text="File Information" />
      {!file && <Empty />}

      {file && (
        <FileDetails
          file={file}
          isOwner={isOwner}
          isAllowed={isAllowed}
          handleFileDownload={handleFileDownload}
          isLoading={isLoading}
          loadingProgress={loadingProgress}
          handleOptimisticUpdate={handleOptimisticUpdate}
        />
      )}

      {file && !isOwner && isAuthenticated && !fileIsTimedTransfer(file) && !file.meta.collection.title && (
        <FileRequests file={file} isAllowed={isAllowed} />
      )}

      {file && (
        <FileHistory history={file.data.history.sort((a, b) => (b.createdAt.unix > a.createdAt.unix ? 1 : -1))} />
      )}
    </div>
  );
};

export default View;
