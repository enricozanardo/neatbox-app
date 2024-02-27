import { useQueryClient } from '@tanstack/react-query';
import config from 'config';
import useAccountData from 'hooks/useAccountData';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getFileById } from 'services/api';
import { File } from 'types';
import { displayFileSize } from 'utils/formatting';
import { fileIsPArtOfCollection, fileIsTimedTransfer } from 'utils/helpers';

import CollectionLink from '../CollectionLink';
import Empty from '../Empty';
import Icon from '../Icon';
import LoadingOverlay from './LoadingOverlay';
import Pagination from './Pagination';

type Props = {
  handlePageChange: (page: number) => void;
  total: number;
  data: File[];
  showLegend?: boolean;
  isLoading?: boolean;
};

const FileTable = ({ handlePageChange, total, data, showLegend, isLoading }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();
  const { account } = useAccountData();

  const handleChange = (page: number) => {
    setCurrentPage(page);
    handlePageChange(page);
  };

  const prefetchFileData = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: ['view', id],
      queryFn: () => getFileById(id),
      staleTime: 60000,
    });
  };

  const ownedItems = account ? account.filesOwned.filter(f => data.find(d => d.data.id === f)) : [];

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <LoadingOverlay isLoading={isLoading} />
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 whitespace-nowrap">
            <tr>
              <th scope="col" className="px-6 py-3 w-full">
                Title
              </th>

              <th scope="col" className="px-6 py-3 text-center">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                File size
              </th>

              {ownedItems.length > 0 && (
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Transfer</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center">
                  <Empty />
                </td>
              </tr>
            )}

            {data.map((item, i) => {
              const isOwnerOfItem = account ? account.filesOwned.includes(item.data.id) : false;
              const itemIsAllowed = account ? account.filesAllowed.includes(item.data.id) : false;
              const isPartOfCollection = fileIsPArtOfCollection(item);

              return (
                <tr className="bg-white" key={item.data.id}>
                  <td
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    onMouseEnter={() => prefetchFileData(item.data.id)}
                  >
                    <Link to={`/view/${item.data.id}`} className="font-bold">
                      {item.data.title}
                    </Link>

                    {fileIsTimedTransfer(item) && <Icon type="faClock" className="text-gray-300 ml-2" />}
                    {isPartOfCollection && <CollectionLink file={item} type="icon" />}
                    {isOwnerOfItem && <Icon type="faUserTie" className="text-gray-300 ml-2" />}
                    {itemIsAllowed && <Icon type="faUserGroup" className="text-gray-300 ml-2" />}
                  </td>
                  <td className="px-6 py-4 text-center">{item.data.type || 'unknown'}</td>
                  <td className="px-6 py-4 text-center">{displayFileSize(item.data.size)}</td>

                  {ownedItems.length > 0 && (
                    <td className="px-6 py-4 text-right">
                      {isOwnerOfItem && !fileIsTimedTransfer(item) && !isPartOfCollection && (
                        <Link to={`/transfer/file?defaultValue=${item.data.id}`} className="font-medium">
                          <Icon type="faRightLeft" />
                        </Link>
                      )}

                      {isOwnerOfItem && isPartOfCollection && (
                        <Link
                          to={`/transfer/collection?defaultValue=${item.meta.collection.id}`}
                          className="font-medium"
                        >
                          <Icon type="faRightLeft" />
                        </Link>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showLegend && (
        <div className="flex justify-center text-xs mt-4 text-gray-400">
          <div>
            <Icon type="faUserTie" className="text-gray-200 mr-1" /> Owner
            <Icon type="faUserGroup" className="ml-8 text-gray-200 mr-1" /> Shared With
            <Icon type="faList" className="ml-8 text-gray-200 mr-1" /> Part of Collection
            <Icon type="faClock" className="ml-8 text-gray-200 mr-1" /> Timed Transfer
          </div>
        </div>
      )}

      {total > 0 && (
        <Pagination
          itemsPerPage={config.ITEMS_PER_PAGE}
          total={total}
          currentPage={currentPage}
          handleChange={handleChange}
        />
      )}
    </>
  );
};

export default FileTable;
