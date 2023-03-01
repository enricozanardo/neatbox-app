import FileTypeIcon from 'components/upload/FileTypeIcon';
import { File } from 'types';

type FileCheckboxProps = {
  checked: boolean;
  file: File;
  handleCheck: (id: string, checked: boolean) => void;
};
export const FileCheckBox = ({ checked, file, handleCheck }: FileCheckboxProps) => {
  return (
    <div className="flex justify-between border-2 border-dashed rounded-xl my-4 p-4 w-full bg-gray-50 ">
      <div className="flex gap-4 ">
        <div className="text-gray-400">
          <FileTypeIcon file={file} />
        </div>
        <div>
          <span>{file.data.title}</span>
        </div>
      </div>
      <div>
        <input
          defaultChecked={checked}
          id="checked-checkbox"
          type="checkbox"
          className="text-secondary-400 bg-gray-100 rounded border-gray-300 focus:ring-secondary-400 mb-1"
          onChange={() => handleCheck(file.data.id, !checked)}
        />
      </div>
    </div>
  );
};
