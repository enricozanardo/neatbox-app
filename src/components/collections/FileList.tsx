import { Link } from 'react-router-dom';

import Spinner from 'components/ui/Spinner';
import { useFileData } from 'hooks/useFileData';

type FileListProps = { fileIds: string[] };
export const FileList = ({ fileIds }: FileListProps) => {
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
