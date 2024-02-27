import { useMutation } from '@tanstack/react-query';
import Empty from 'components/ui/Empty';
import useAccountData from 'hooks/useAccountData';
import { toast } from 'react-hot-toast';
import { sendCancelRequestAsset } from 'services/transactions';
import useWallet from 'hooks/useWallet';
import { CancelRequestAssetProps, Collection, File } from 'types';
import { handleError } from 'utils/errors';
import { prepareCollectionRequests, prepareFileRequests } from 'utils/helpers';

import { RequestsTable } from './RequestsTable';

type Props = {
  files: File[];
  collections: Collection[];
};

const PendingRequests = ({ files, collections }: Props) => {
  const { wallet } = useWallet();
  const { removeRequests, account } = useAccountData();

  const handleCancelRequest = async (data: CancelRequestAssetProps) => {
    if (!wallet?.passphrase) {
      toast.error('No passphrase defined');
      return;
    }
    const asset: CancelRequestAssetProps = data;
    mutate({ passphrase: wallet.passphrase, asset });
  };

  const { mutate } = useMutation({
    mutationFn: ({ passphrase, asset }: { passphrase: string; asset: CancelRequestAssetProps }) =>
      sendCancelRequestAsset(passphrase, asset),
    onSuccess: (_, { asset }) => {
      toast.success(`Request successfully cancelled`);
      removeRequests([asset.requestId]);
    },
    onError: handleError,
  });

  if (!account) {
    return null;
  }

  const fileRequests = prepareFileRequests(files, account.outgoingFileRequests);
  const collectionRequests = prepareCollectionRequests(collections, account.outgoingCollectionRequests);

  return (
    <section className="mt-16">
      <h2 className="text-center mb-4">Pending Requests</h2>

      {fileRequests.length === 0 && collectionRequests.length === 0 ? (
        <Empty />
      ) : (
        <RequestsTable
          fileRequests={fileRequests}
          collectionRequests={collectionRequests}
          handleCancelRequest={handleCancelRequest}
        />
      )}
    </section>
  );
};

export default PendingRequests;
