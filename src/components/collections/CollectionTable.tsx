import { useFileData } from 'hooks/useFileData';
import { useOwnedFilesData } from 'hooks/useOwnedFilesData';
import { useEffect, useState } from 'react';
import { Collapse } from 'react-collapse';
import { Link } from 'react-router-dom';
import { Collection, File } from 'types';
import { displayNumber } from 'utils/formatting';

import Button from '../ui/Button';
import Empty from '../ui/Empty';
import Spinner from '../ui/Spinner';
import UpdateCollection from './UpdateCollection';

type FileListProps = { fileIds: string[] };

const FileList = ({ fileIds }: FileListProps) => {
  const { files, total, isLoading } = useFileData(fileIds);

  if (!total) {
    return <div className="text-center w-full ml-8">This collection contains no files</div>;
  }

  return (
    <ul className="list-disc ml-16 mb-4 w-full whitespace-nowrap">
      {isLoading && <Spinner />}

      {!isLoading &&
        files.map(a => (
          <li className="list-disc" key={a.data.id}>
            <Link to={`/view/${a.data.id}`}>{a.data.title}</Link>
          </li>
        ))}
    </ul>
  );
};

type RowProps = { collection: Collection; ownedFiles: File[] };

const CollectionTableRow = ({ collection, ownedFiles }: RowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (collection.fileIds.length === 0) {
      setIsExpanded(false);
    }
  }, [collection.fileIds]);

  return (
    <>
      <tr className="bg-white">
        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
          {collection.title}

          {collection.fileIds.length > 0 && (
            <Button link onClick={() => setIsExpanded(!isExpanded)} className="ml-4">
              {!isExpanded ? 'Expand' : 'Collapse'}
            </Button>
          )}
        </td>

        <td className="px-6 py-4 text-center">{displayNumber(collection.fileIds.length)}</td>

        <td className="px-6 py-4 text-center hidden md:block">{displayNumber(collection.transferFee)}</td>

        <td className="px-6 py-4 text-right">
          <UpdateCollection collection={collection} ownedFiles={ownedFiles} />
        </td>

        <td className="px-6 py-4 text-right">
          <Link to={`/transfer/collection?defaultValue=${collection.id}`} className="font-medium">
            Transfer
          </Link>
        </td>
      </tr>

      <tr className="w-full">
        <td colSpan={4}>
          <Collapse isOpened={isExpanded}>
            <FileList fileIds={collection.fileIds} />
          </Collapse>
        </td>
      </tr>
    </>
  );
};

type TableProps = { data: Collection[] };

const CollectionTable = ({ data }: TableProps) => {
  const { files } = useOwnedFilesData({ limit: -1 });

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
            <CollectionTableRow collection={item} key={item.id} ownedFiles={files} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CollectionTable;
