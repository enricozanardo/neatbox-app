import Button from 'components/ui/Button';
import CollectionLink from 'components/ui/CollectionLink';
import DetailBlock from 'components/ui/DetailBlock';
import DetailInline from 'components/ui/DetailInline';
import Hr from 'components/ui/Hr';
import Spinner from 'components/ui/Spinner';
import { CustomField } from 'components/upload/CustomFields';
import FileTypeIcon from 'components/upload/FileTypeIcon';
import { Link } from 'react-router-dom';
import { File } from 'types';
import { displayDate, displayDateTime, displayFileSize, displayNumber } from 'utils/formatting';
import { bufferToJson, fileIsPArtOfCollection, fileIsTimedTransfer } from 'utils/helpers';

import UpdateFile from './UpdateFile';

type Props = {
  file: File;
  isOwner: boolean;
  isAllowed: boolean;
  handleFileDownload: () => void;
  isLoading: boolean;
  loadingProgress: number;
  handleOptimisticUpdate: (updatedData: Partial<File>) => void;
};

const FileDetails = ({
  file,
  isOwner,
  isAllowed,
  handleFileDownload,
  isLoading,
  loadingProgress,
  handleOptimisticUpdate,
}: Props) => {
  const customFields: CustomField[] = bufferToJson(file.data.customFields) || [];
  const isTimed = fileIsTimedTransfer(file);
  const isPartOfCollection = fileIsPArtOfCollection(file);

  return (
    <div className="flex justify-center text-sm">
      <div className="shadow-md rounded-lg bg-white p-8 border-2 border-gray-50 w-full">
        <div className="flex justify-end h-4">
          {isOwner && !isTimed && <UpdateFile file={file} handleOptimisticUpdate={handleOptimisticUpdate} />}
        </div>

        <div className="flex justify-center gap-4 items-center mt-4">
          <h1 className="text-secondary-200">
            <FileTypeIcon file={file} />
          </h1>

          <h3 className="block">{file.data.title}</h3>
        </div>

        {file.meta.collection.title && (
          <p className="text-center text-xs text-gray-400 font-semibold">
            Part of: <CollectionLink file={file} type="text" />
          </p>
        )}

        <Hr text="File Details" className="mt-8" />
        <DetailInline label="Name" value={file.data.name} />
        <DetailInline label="Size" value={displayFileSize(file.data.size)} />
        <DetailInline label="Type" value={file.data.type || 'unknown'} />

        <div className="h-4" />
        <DetailInline label="Created at" value={displayDateTime(file.meta.createdAt.human)} />
        <DetailInline label="Last modified" value={displayDateTime(file.meta.lastModified.human)} />
        <div className="h-4" />
        <DetailInline label="Transfer fee" value={`${displayNumber(file.data.transferFee)} tokens`} />
        <DetailInline
          label="Access Permission fee"
          value={isTimed ? 'N/A' : `${displayNumber(file.data.accessPermissionFee)} tokens`}
        />
        <DetailInline label="Timed Transfer" value={isTimed ? 'Yes' : 'No'} />
        <DetailInline label="Expiration" value={isTimed ? displayDate(file.meta.expiration.human) : 'N/A'} />

        <Hr text="Cryptography" className="mt-12" />
        <DetailBlock label="Identifier" value={file.data.id} />
        <DetailBlock label="Checksum" value={file.data.checksum} />
        <DetailBlock label="Hash" value={file.data.hash} />

        {customFields.length > 0 && (
          <>
            <Hr text="Custom Fields" className="mt-12" />
            {customFields.map((f, i) => (
              <DetailInline key={`${f.name}-${i}`} label={f.name} value={f.value} />
            ))}
          </>
        )}

        <Hr text="Actions" className="mt-12" />

        {isLoading && (
          <div className="text-center h-7">
            <span className="text-secondary-500 mr-2">
              <Spinner />
            </span>
            <span className="font-bold">{loadingProgress} %</span>

            <span className="text-xs text-gray-400 block">
              {loadingProgress === 0 ? 'Processing...' : 'Downloading...'}
            </span>
          </div>
        )}

        {!isLoading && (
          <div className="flex justify-center gap-4">
            {isOwner && !isTimed && !isPartOfCollection && (
              <Link to={`/transfer/file?defaultValue=${file.data.id}`} className="text-black">
                <Button color="primary-bordered">Transfer</Button>
              </Link>
            )}

            <Button onClick={handleFileDownload} disabled={!(isAllowed || isOwner)}>
              Download
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileDetails;
