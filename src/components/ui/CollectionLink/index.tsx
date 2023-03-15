import Button from 'components/ui/Button';
import CollectionModal from 'components/ui/CollectionLink/CollectionModal';
import Icon from 'components/ui/Icon';
import { useState } from 'react';
import { File } from 'types';

type Props = {
  type: 'text' | 'icon';
  file: File;
};

const CollectionLink = ({ type, file }: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsMounted, setModalIsMounted] = useState(false);

  const handleMouseHover = () => {
    if (modalIsMounted) {
      return;
    }

    setModalIsMounted(true);
  };

  return (
    <>
      <div onMouseEnter={handleMouseHover} className="inline">
        <Button link onClick={() => setModalIsOpen(true)}>
          {type === 'text' ? file.meta.collection.title : <Icon type="faList" className=" ml-2" />}
        </Button>
      </div>

      {modalIsMounted && (
        <CollectionModal
          collectionMeta={file.meta.collection}
          modalIsOpen={modalIsOpen}
          setModalIsOpen={setModalIsOpen}
        />
      )}
    </>
  );
};

export default CollectionLink;
