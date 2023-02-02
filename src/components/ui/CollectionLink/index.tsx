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
  const [initialized, setInitialized] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(true);

  /** utilize initialize value to avoid excess amounts of API requests from CollectionModal */
  const handleButtonClick = () => {
    if (!initialized) {
      setInitialized(true);
      return;
    }

    setModalIsOpen(true);
  };

  return (
    <>
      <Button link onClick={handleButtonClick}>
        {type === 'text' ? file.meta.collection.title : <Icon type="faList" className=" ml-2" />}
      </Button>

      {initialized && (
        <CollectionModal
          collectionMeta={file.meta.collection}
          modalIsOpen={modalIsOpen}
          closeHandler={() => setModalIsOpen(false)}
        />
      )}
    </>
  );
};

export default CollectionLink;
