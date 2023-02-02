import { useCollectionData } from 'hooks/useCollectionData';

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
  const { collection, isLoading } = useCollectionData(collectionMeta.id);

  return (
    <Modal title="Collection Details" isOpen={modalIsOpen} handleClose={closeHandler}>
      {isLoading && <Spinner />}

      {!isLoading && collection && <CollectionView collection={collection} closeHandler={closeHandler} />}
      {!isLoading && !collection && <Empty />}

      <Hr className="my-4" />
      <div className="flex justify-center">
        <Button onClick={closeHandler}>Close</Button>
      </div>
    </Modal>
  );
};

export default CollectionModal;
