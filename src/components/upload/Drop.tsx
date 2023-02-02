import Icon from 'components/ui/Icon';
import config from 'config';
import { useCallback, useEffect, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { generateChecksum } from 'utils/crypto';
import { displayFileSize } from 'utils/formatting';

type Props = {
  file: FileWithPath | null;
  handleFileChange: (file?: FileWithPath, checksum?: string) => void;
  isTimedTransfer: boolean;
};

export default function Drop({ file, handleFileChange, isTimedTransfer }: Props) {
  const [error, setError] = useState('');

  const maxSize = isTimedTransfer ? config.MAX_TIMED_TRANSFER_FILE_SIZE : config.MAX_UPLOAD_FILE_SIZE;

  /** remove error when switching to a timed transfer and no file is selected */
  useEffect(() => {
    if (isTimedTransfer && !file) {
      setError('');
    }
  }, [isTimedTransfer, file]);

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      handleFileChange();
      setError('');

      if (acceptedFiles.length > 1) {
        setError('Only one file is allowed');
        return;
      }

      const file = acceptedFiles[0];

      const checksum = await generateChecksum(file);

      if (file.size > maxSize) {
        setError(`File exceeds maximum size of ${displayFileSize(maxSize)}`);
        return;
      }

      handleFileChange(acceptedFiles[0], checksum);
    },
    [handleFileChange, maxSize],
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <>
      <div
        {...getRootProps()}
        className="w-full bg-gray-100 p-12 border-2 border-dashed border-gray-400 text-center rounded-xl cursor-pointer"
      >
        <input {...getInputProps()} />

        <Icon type="faCloudArrowUp" className="text-4xl text-gray-400" />

        <p className="mt-2">
          {file && (
            <span className="font-bold">
              {file.name} - {displayFileSize(file.size)} ({file.type})
            </span>
          )}

          {!file && `Drag 'n' drop a file here, or click to select one (max ${displayFileSize(maxSize)})`}
        </p>
      </div>

      {error && <p className="text-center text-red-400">{error}</p>}
    </>
  );
}
