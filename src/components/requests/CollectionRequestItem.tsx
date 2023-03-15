import Button from 'components/ui/Button';
import Hr from 'components/ui/Hr';
import Icon from 'components/ui/Icon';
import Spinner from 'components/ui/Spinner';
import { useFileData } from 'hooks/useFileData';
import { Link } from 'react-router-dom';
import { Collection, CollectionRequest, CollectionRequestType } from 'types';
import { bufferToHex } from 'utils/crypto';
import { displayNumber } from 'utils/formatting';

type Props = {
  request: CollectionRequest;
  collection: Collection;
  handleResponse: (request: CollectionRequest, collection: Collection, accept: boolean) => void;
  isLoading: boolean;
  disableInteraction: boolean;
};

export const CollectionRequestItem = ({
  request,
  collection,
  handleResponse,
  isLoading,
  disableInteraction,
}: Props) => {
  const style = {
    [CollectionRequestType.Ownership]: {
      header: 'Ownership Request',
      icon: <Icon type="faList" />,
    },
    [CollectionRequestType.Transfer]: {
      header: 'Transfer Request',
      icon: <Icon type="faDownload" />,
    },
  };

  const { header, icon } = style[request.type];
  const { files } = useFileData(collection.fileIds);

  return (
    <div className="border-2 border-dashed border-gray-400 p-8 rounded-xl bg-white">
      <div className="flex justify-center md:justify-between items-center text-center md:text-left">
        <div>
          <div className="block">
            <span className="font-bold">{header} request for:</span>{' '}
            <h4 className="inline ml-2">{collection.title.toUpperCase()}</h4>
            <span className="block">Required Fee: {displayNumber(collection.transferFee)} tokens</span>
          </div>

          <div className="my-8" />

          <div>
            <span>Files in collection: </span>
            <ul className="ml-8">
              {files.map(f => (
                <li key={f.data.id} className="list-disc">
                  <Link to={`/view/${f.data.id}`}>{f.data.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="my-8" />

          <span className="text-xs block">Sent by: {bufferToHex(request.sender)}</span>

          <span className="text-xs text-gray-400 hidden md:block">
            <span className="block md:inline">Request ID:</span> {request.requestId}
          </span>
        </div>

        <div className="text-6xl text-secondary-200 hidden md:block">{icon}</div>
      </div>

      <Hr text="Action" />

      {isLoading && (
        <div className="text-center h-7">
          <span className="text-secondary-500 mr-2">
            <Spinner />
          </span>

          <span className="text-xs text-gray-400 block">Processing... do not close the browser.</span>
        </div>
      )}

      {!isLoading && (
        <div className="flex justify-center gap-4">
          <Button link onClick={() => handleResponse(request, collection, false)} disabled={disableInteraction}>
            Decline
          </Button>
          <Button link onClick={() => handleResponse(request, collection, true)} disabled={disableInteraction}>
            Accept
          </Button>
        </div>
      )}
    </div>
  );
};
