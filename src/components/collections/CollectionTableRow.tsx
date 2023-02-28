import { useEffect, useState } from 'react';
import { Collapse } from 'react-collapse';
import { Link } from 'react-router-dom';
import { Collection, File, UpdateCollectionAssetProps } from 'types';
import { displayNumber } from 'utils/formatting';

import Button from '../ui/Button';
import { FileList } from './FileList';
import UpdateCollection from './UpdateCollection';

type RowProps = {
  collection: Collection;
  ownedFiles: File[];
  optimisticallyUpdateCollection: (asset: UpdateCollectionAssetProps) => void;
  optimisticallyUpdateFileCollection: (fileIds: string[], collection: Collection) => void;
};

export const CollectionTableRow = ({
  collection,
  ownedFiles,
  optimisticallyUpdateCollection,
  optimisticallyUpdateFileCollection,
}: RowProps) => {
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
          <UpdateCollection
            collection={collection}
            ownedFiles={ownedFiles}
            optimisticallyUpdateCollection={optimisticallyUpdateCollection}
            optimisticallyUpdateFileCollection={optimisticallyUpdateFileCollection}
          />
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
