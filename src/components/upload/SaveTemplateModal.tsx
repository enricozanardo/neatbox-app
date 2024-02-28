import { useEffect, useState } from 'react';

import Button from 'components/ui/Button';
import Modal from 'components/ui/Modal';

type Props = {
  modalIsOpen: boolean;
  handleClose: () => void;
  handleConfirm: (name: string) => void;
  selectedTemplate: string;
};

const SaveTemplateModal = ({ modalIsOpen, handleClose, handleConfirm, selectedTemplate }: Props) => {
  const [templateName, setTemplateName] = useState('');

  useEffect(() => {
    setTemplateName(selectedTemplate);
  }, [selectedTemplate]);

  const onSubmit = () => {
    handleConfirm(templateName);
    setTemplateName('');
    handleClose();
  };

  const handleCancel = () => {
    setTemplateName('');
    handleClose();
  };

  return (
    <Modal title="Save Template" isOpen={modalIsOpen} handleClose={handleClose}>
      <div className="text-center mb-8">
        <input
          placeholder="Enter template name.."
          value={templateName}
          type="text"
          className="base-input"
          onChange={e => setTemplateName(e.target.value)}
        />
      </div>

      <div className="flex justify-center gap-8">
        <Button type="button" color="primary-bordered" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>Save</Button>
      </div>
    </Modal>
  );
};

export default SaveTemplateModal;
