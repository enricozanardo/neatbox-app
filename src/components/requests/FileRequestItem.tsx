import Button from 'components/ui/Button';
import Hr from 'components/ui/Hr';
import Icon from 'components/ui/Icon';
import Spinner from 'components/ui/Spinner';
import { File, FileRequest, FileRequestType } from 'types';
import { bufferToHex } from 'utils/crypto';

type Props = {
  request: FileRequest;
  asset: File;
  handleResponse: (request: FileRequest, accept: boolean) => void;
  isLoading: boolean;
  disableInteraction: boolean;
};

export const FileRequestItem = ({ request, asset, handleResponse, isLoading, disableInteraction }: Props) => {
  const style = {
    [FileRequestType.Ownership]: {
      header: 'Ownership Request',
      icon: <Icon type="faFile" />,
    },

    [FileRequestType.AccessPermission]: {
      header: 'Access Permission Request',
      icon: <Icon type="faDownload" />,
    },

    [FileRequestType.Transfer]: {
      header: 'Transfer Request',
      icon: <Icon type="faDownload" />,
    },

    [FileRequestType.TimedTransfer]: {
      header: 'Timed Transfer Request',
      icon: <Icon type="faDownload" />,
    },
  };

  const { header, icon } = style[request.type];

  return (
    <div className="border-2 border-dashed border-gray-400 p-8 rounded-xl bg-white">
      <div className="flex justify-center md:justify-between items-center text-center md:text-left">
        <div className="space-y-4">
          <span className="font-bold block">
            {header} for: <h4 className="inline ml-2">{asset.data.title.toUpperCase()}</h4>
          </span>

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
          <Button link onClick={() => handleResponse(request, false)} disabled={disableInteraction}>
            Decline
          </Button>
          <Button link onClick={() => handleResponse(request, true)} disabled={disableInteraction}>
            Accept
          </Button>
        </div>
      )}
    </div>
  );
};
