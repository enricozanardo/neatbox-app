import Button from 'components/ui/Button';
import { CancelRequestAssetProps, Collection, CollectionRequest, File, FileRequest } from 'types';
import { getTransactionTimestamp } from 'utils/helpers';

import { requestTypeMap } from './IncomingFileRequests';

type Props = {
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
export const RequestsTable = ({ fileRequests, collectionRequests, handleCancelRequest }: Props) => (
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
