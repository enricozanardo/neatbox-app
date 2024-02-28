import { HistoryItem, HistoryItemType } from 'types';
import { getLisk32AddressFromAddress } from 'utils/crypto';
import { displayDateTime } from 'utils/formatting';

type Props = {
  item: HistoryItem;
};

const contentMap: {
  [key in HistoryItemType]: {
    title: string;
    color: string;
    body: string;
  };
} = {
  [HistoryItemType.Transfer]: {
    title: 'File Transfer',
    color: 'text-blue-400',
    body: 'Transferred to: ',
  },
  [HistoryItemType.AccessPermission]: {
    title: 'Access Permission Granted',
    color: 'text-orange-400',
    body: 'Granted to: ',
  },
  [HistoryItemType.Registration]: {
    title: 'File Registered',
    color: 'text-green-400',
    body: 'Owner: ',
  },
  [HistoryItemType.TimedTransferSubmission]: {
    title: 'Timed Transfer Initiated',
    color: 'text-purple-400',
    body: 'Sender: ',
  },
  [HistoryItemType.TimedTransferResponse]: {
    title: 'Timed Transfer Completed',
    color: 'text-cyan-400',
    body: 'Transferred to: ',
  },
  [HistoryItemType.AddedToCollection]: {
    title: 'Added to Collection',
    color: 'text-lime-400',
    body: 'Added by: ',
  },
  [HistoryItemType.RemovedFromCollection]: {
    title: 'Removed from Collection',
    color: 'text-indigo-400',
    body: 'Removed by: ',
  },
  [HistoryItemType.TransferredViaCollection]: {
    title: 'Transferred via Collection',
    color: 'text-pink-400',
    body: 'Transferred to: ',
  },
};

const fallBack = {
  title: 'Unknown Activity',
  color: 'text-yellow-400',
  body: 'Account: ',
};

const FileHistoryItem = ({ item }: Props) => {
  const content = contentMap[item.activity] || fallBack;

  return (
    <div className="flex mb-6">
      <div className={`mr-4 ${content.color}`}>○</div>

      <div className="flex flex-col truncate">
        <div className="font-semibold">{content.title}</div>
        <div className="text-xs text-gray-400 mb-2">{displayDateTime(item.createdAt.human)}</div>

        <div className="text-sm ">
          {content.body} {getLisk32AddressFromAddress(item.userAddress)}
        </div>
      </div>
    </div>
  );
};

export default FileHistoryItem;
