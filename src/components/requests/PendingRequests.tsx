import Button from 'components/ui/Button';
import Empty from 'components/ui/Empty';
import { toast } from 'react-hot-toast';
import { sendCancelRequestAsset } from 'services/transactions';
import { useAccountStore } from 'stores/useAccountStore';
import { useWalletStore } from 'stores/useWalletStore';
import { CancelRequestAssetProps, Collection, CollectionRequest, File, FileRequest } from 'types';
import { getTransactionTimestamp, prepareCollectionRequests, prepareFileRequests } from 'utils/helpers';

import { requestTypeMap } from './IncomingFileRequests';

type TableProps = {
  fileRequests: {
    request: FileRequest;
    file: File;
  }[];
  collectionRequests: {
    request: CollectionRequest;
    collection: Collection;
  }[];
  handleCancelRequest: (data: CancelRequestAssetProps) => void;
};

const RequestsTable = ({ fileRequests, collectionRequests, handleCancelRequest }: TableProps) => (
  <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 whitespace-nowrap">
        <tr>
          <th scope="col" className="px-6 py-3">
            Title
          </th>
          <th scope="col" className="px-6 py-3 ">
            Type
          </th>
          <th scope="col" className="px-6 py-3 text-center">
            Action
          </th>
        </tr>
      </thead>
      <tbody className="bg-white relative">
        {fileRequests.map(({ file, request }) => (
          <tr key={request.requestId}>
            <td className="px-6 py-4 font-bold">{file.data.name}</td>
            <td className="px-6 py-4">{requestTypeMap[request.type]}</td>
            <td className="px-6 py-4 text-center">
              <Button
                link
                onClick={() =>
                  handleCancelRequest({
                    requestId: request.requestId,
                    fileId: file.data.id,
                    collectionId: '',
                    timestamp: getTransactionTimestamp(),
                  })
                }
              >
                Cancel
              </Button>
            </td>
          </tr>
        ))}

        {collectionRequests.map(({ collection, request }) => (
          <tr key={request.requestId}>
            <td className="px-6 py-4 font-bold">{collection.title}</td>
            <td className="px-6 py-4">Collection Transfer</td>
            <td className="px-6 py-4 text-center">
              <Button
                link
                onClick={() =>
                  handleCancelRequest({
                    requestId: request.requestId,
                    collectionId: request.collectionId,
                    fileId: '',
                    timestamp: getTransactionTimestamp(),
                  })
                }
              >
                Cancel
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

type Props = {
  files: File[];
  collections: Collection[];
};

const PendingRequests = ({ files, collections }: Props) => {
  const wallet = useWalletStore(state => state.wallet);
  const { removeRequests, account } = useAccountStore(state => ({
    removeRequests: state.removeRequests,
    account: state.account,
  }));
  const setIgnoreRefresh = useAccountStore(state => state.setIgnoreRefresh);

  if (!account) {
    return null;
  }

  const handleCancelRequest = async (data: CancelRequestAssetProps) => {
    if (!wallet?.passphrase) {
      toast.error('No passphrase defined');
      return;
    }

    try {
      const txAsset: CancelRequestAssetProps = data;

      await sendCancelRequestAsset(wallet.passphrase, txAsset);

      setIgnoreRefresh(true);
      removeRequests([data.requestId]);
      toast.success(`Request successfully cancelled`);
    } catch (err) {
      // Todo: create proper error handler
      // @ts-ignore
      toast.error(err.message);
    }
  };

  const fileRequests = prepareFileRequests(files, account.storage.outgoingFileRequests);
  const collectionRequests = prepareCollectionRequests(collections, account.storage.outgoingCollectionRequests);

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
