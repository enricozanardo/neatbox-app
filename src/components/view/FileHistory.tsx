import Hr from 'components/ui/Hr';
import { HistoryItem } from 'types';

import FileHistoryItem from './FileHistoryItem';

type Props = {
  history: HistoryItem[];
};

const FileHistory = ({ history }: Props) => {
  return (
    <div className="shadow-md rounded-lg bg-white p-8 border-2 border-gray-50 w-full mt-16">
      <h5 className="text-center">History</h5>

      <Hr className="mb-4" />

      {history.map(item => (
        <FileHistoryItem item={item} key={item.createdAt.unix} />
      ))}
    </div>
  );
};

export default FileHistory;
