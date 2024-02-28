import { useEffect, useState } from 'react';

import useAccountData from 'hooks/useAccountData';
import { getCollectionsByIds, getFilesByIds } from 'services/api';
import { Collection, File } from 'types';
import { removeDuplicates } from 'utils/helpers';

import IncomingCollectionRequests from './IncomingCollectionRequests';
import IncomingFileRequests from './IncomingFileRequests';
import PendingRequests from './PendingRequests';

const Requests = () => {
  const [filesInRequests, setFilesInRequests] = useState<File[]>([]);
  const [collectionsInRequests, setCollectionsInRequests] = useState<Collection[]>([]);

  const { account } = useAccountData();

  useEffect(() => {
    if (!account) {
      return;
    }

    const { incomingFileRequests, outgoingFileRequests, incomingCollectionRequests, outgoingCollectionRequests } =
      account;

    const fileIdsToRequest = [...incomingFileRequests, ...outgoingFileRequests].map(req => req.fileId);

    const fetchFileData = async () => {
      const data = await getFilesByIds(removeDuplicates(fileIdsToRequest), { limit: -1 });
      setFilesInRequests(data.files);
    };

    const collectionIdsToRequest = [...incomingCollectionRequests, ...outgoingCollectionRequests].map(
      req => req.collectionId,
    );

    const fetchCollectionData = async () => {
      const data = await getCollectionsByIds(removeDuplicates(collectionIdsToRequest), { limit: -1 });
      setCollectionsInRequests(data.collections);
    };

    fetchFileData();
    fetchCollectionData();
  }, [account]);

  if (!account) {
    return null;
  }

  return (
    <div className="w-full">
      <IncomingFileRequests files={filesInRequests} />

      <IncomingCollectionRequests
        collections={collectionsInRequests.filter(c =>
          account.incomingCollectionRequests.map(req => req.collectionId).includes(c.id),
        )}
      />

      <PendingRequests files={filesInRequests} collections={collectionsInRequests} />
    </div>
  );
};

export default Requests;
