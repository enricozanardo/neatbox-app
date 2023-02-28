import useAccountData from 'hooks/useAccountData';
import { useFileData } from 'hooks/useFileData';
import { Collection, UpdateCollectionAssetProps } from 'types';

import Empty from '../ui/Empty';
import { CollectionTableRow } from './CollectionTableRow';

type TableProps = { data: Collection[]; optimisticallyUpdateCollection: (asset: UpdateCollectionAssetProps) => void };

const CollectionTable = ({ data, optimisticallyUpdateCollection }: TableProps) => {
  const { account } = useAccountData();
  const { files, optimisticallyUpdateFileCollection } = useFileData(account?.storage.filesOwned ?? [], { limit: -1 }, [
    'account',
    'filesOwned',
  ]);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 whitespace-nowrap">
          <tr>
            <th scope="col" className="px-6 py-3 w-full">
              Title
            </th>

            <th scope="col" className="px-6 py-3 text-center">
              Files
            </th>

            <th scope="col" className="px-6 py-3 text-center hidden md:block">
              Transfer Fee
            </th>

            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>

            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Transfer</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {data.length === 0 && (
            <tr>
              <td colSpan={5}>
                <Empty />
              </td>
            </tr>
          )}

          {data.map((item, i) => (
            <CollectionTableRow
              collection={item}
              key={item.id}
              ownedFiles={files}
              optimisticallyUpdateCollection={optimisticallyUpdateCollection}
              optimisticallyUpdateFileCollection={optimisticallyUpdateFileCollection}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CollectionTable;
