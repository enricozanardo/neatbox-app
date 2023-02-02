import { useFileData } from 'hooks/useFileData';
import { useNavigate } from 'react-router-dom';
import { Collection } from 'types';
import { displayNumber } from 'utils/formatting';

import Button from '../Button';
import DetailInline from '../DetailInline';
import Spinner from '../Spinner';

type Props = {
  collection: Collection;
  closeHandler: () => void;
};

const CollectionView = ({ collection, closeHandler }: Props) => {
  const { files, isLoading } = useFileData(collection.fileIds);
  const navigate = useNavigate();

  const handleClick = (fileId: string) => {
    closeHandler();
    navigate(`/view/${fileId}`);
  };

  const renderFileList = () => (
    <ul className="list-disc ml-8 ">
      {files.map(f => (
        <li key={f.data.id}>
          <Button link onClick={() => handleClick(f.data.id)}>
            {f.data.title}
          </Button>
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <h3 className="text-center ">{collection.title}</h3>

      <div className="flex justify-center text-sm">
        <div className=" w-full max-w-md">
          <DetailInline label="Title" value={collection.title} />
          <DetailInline label="Transfer fee" value={`${displayNumber(collection.transferFee)} tokens`} />

          {isLoading && <Spinner />}
          {!isLoading && (
            <div className="mt-4">
              <div className="mb-2">Files in Collection ({files.length})</div>
              {renderFileList()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionView;
