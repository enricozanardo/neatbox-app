import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getCollectionById, getFilesByIds } from 'services/api';

import Button from '../Button';
import Empty from '../Empty';
import Hr from '../Hr';
import Modal from '../Modal';
import Spinner from '../Spinner';
import CollectionView from './CollectionView';

type Props = {
  collectionMeta: { id: string; title: string };
  closeHandler: () => void;
  modalIsOpen: boolean;
};

const CollectionModal = ({ collectionMeta, closeHandler, modalIsOpen }: Props) => {
  const queryClient = useQueryClient();

  const { isLoading, data } = useQuery({
    queryKey: ['collection', collectionMeta.id],
    queryFn: () => getCollectionById(collectionMeta.id),
  });

  useEffect(() => {
    const prefetch = async () => {
      if (!data) {
        return;
      }

      await queryClient.prefetchQuery({
        queryKey: ['collection', data.id, 'files', data.fileIds],
        queryFn: () => getFilesByIds(data.fileIds),
      });
    };

    prefetch();
  }, [data, queryClient]);

  return (
    <Modal title="Collection Details" isOpen={modalIsOpen} handleClose={closeHandler}>
      {isLoading && <Spinner />}
      {!isLoading && data && <CollectionView collection={data} closeHandler={closeHandler} />}
      {!isLoading && !data && <Empty />}

      <Hr className="my-4" />
      <div className="flex justify-center">
        <Button onClick={closeHandler}>Close</Button>
      </div>
    </Modal>
  );
};

export default CollectionModal;
