import { Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'components/ui/Button';
import DetailInline from 'components/ui/DetailInline';
import Empty from 'components/ui/Empty';
import Spinner from 'components/ui/Spinner';
import { useFileData } from 'hooks/useFileData';
import { Collection } from 'types';
import { displayNumber } from 'utils/formatting';

type Props = {
  collection: Collection;
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
};

const CollectionView = ({ collection, setModalIsOpen }: Props) => {
  const { isLoading, files, total } = useFileData(collection.fileIds, {}, ['collection', collection.id]);
  const navigate = useNavigate();

  const closeHandler = () => {
    setModalIsOpen(false);
  };

  const handleNavigate = (fileId: string) => {
    closeHandler();
    navigate(`/view/${fileId}`);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (total === 0) {
    return <Empty />;
  }

  const renderFileList = () => (
    <ul className="list-disc ml-8 ">
      {files.map(f => (
        <li key={f.data.id}>
          <Button link onClick={() => handleNavigate(f.data.id)}>
            {f.data.title}
          </Button>
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <h3 className="text-center mb-4">{collection.title}</h3>

      <div className="flex justify-center text-sm">
        <div className=" w-full max-w-md">
          <DetailInline label="Title" value={collection.title} />
          <DetailInline label="Transfer fee" value={`${displayNumber(collection.transferFee)} tokens`} />

          {isLoading && <Spinner />}
          {!isLoading && (
            <div className="mt-4">
              <div className="mb-2">Files in Collection ({total})</div>
              {renderFileList()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionView;
