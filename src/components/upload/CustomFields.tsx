import Button from 'components/ui/Button';
import Icon from 'components/ui/Icon';
import Label from 'components/ui/Label';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import * as storage from 'utils/storage';

import SaveTemplateModal from './SaveTemplateModal';

export type CustomField = {
  name: string;
  value: string;
};

export type Template = {
  id: string;
  customFields: CustomField[];
};

type Props = {
  customFields: CustomField[];
  setCustomFields: React.Dispatch<React.SetStateAction<CustomField[]>>;
  isUpdate?: boolean;
};

const CustomFields = ({ customFields, setCustomFields, isUpdate }: Props) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templates, setTemplates] = useState(
    storage.getFromLocalStorage<Template[]>('templates') || ([] as Template[]),
  );
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const updateCustomField = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const updatedFields = [...customFields];
    updatedFields[i][e.target.name as 'name' | 'value'] = e.target.value;
    setCustomFields(updatedFields);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
    toast.success('Custom field removed');
  };

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    setCustomFields(templates.find(t => t.id === template)?.customFields || []);

    if (template) {
      toast.success(`Switched template to ${template}!`);
    }
  };

  const handleAddField = () => {
    setCustomFields([...customFields, { name: '', value: '' }]);
    toast.success('Custom field added');
  };

  const onSaveTemplate = () => {
    if (selectedTemplate) {
      handleSaveTemplate(selectedTemplate);
      return;
    }

    setModalIsOpen(true);
  };

  const handleSaveTemplate = (name: string) => {
    const updatedTemplates = [...templates];

    const existingTemplate = updatedTemplates.find(t => t.id === selectedTemplate);

    if (existingTemplate) {
      existingTemplate.customFields = customFields;
    } else {
      updatedTemplates.push({ id: name, customFields });
    }

    storage.setToLocalStorage(updatedTemplates, 'templates');
    setTemplates(updatedTemplates);

    toast.success('Template saved!');

    setSelectedTemplate(name);
    setCustomFields(customFields);
  };

  const handleDeleteTemplate = () => {
    const updatedTemplates = templates.filter(t => t.id !== selectedTemplate);
    setTemplates(updatedTemplates);
    resetCustomFields();
    storage.setToLocalStorage(updatedTemplates, 'templates');
    toast.success('Template deleted!');
  };

  const resetCustomFields = () => {
    setSelectedTemplate('');
    setCustomFields([]);
  };

  return (
    <>
      {!isUpdate && (
        <label className="block">
          <Label text="Template" />
          <select
            className="base-input"
            placeholder="Select a template"
            value={selectedTemplate}
            onChange={e => handleTemplateChange(e.target.value)}
          >
            <option value="">New template</option>

            {templates.map(t => (
              <option value={t.id} key={t.id}>
                {t.id}
              </option>
            ))}
          </select>
        </label>
      )}

      <div>
        {customFields.length > 0 && <Label text="Custom Fields" />}
        {customFields.map((field, i) => (
          <div key={`custom-field-${i}`} className="flex gap-4 mb-2">
            <input
              placeholder="Field name"
              value={customFields[i].name}
              onChange={e => updateCustomField(e, i)}
              type="text"
              className="base-input"
              name="name"
            />
            <input
              placeholder="Field value"
              value={customFields[i].value}
              onChange={e => updateCustomField(e, i)}
              type="text"
              className="base-input"
              name="value"
            />

            <button onClick={() => removeCustomField(i)}>
              <Icon type="faTrash" className="mt-1 text-lg" />
            </button>
          </div>
        ))}
      </div>

      {!isUpdate && (
        <>
          <div className="flex justify-center gap-2 md:gap-8">
            <Button color="primary-bordered" onClick={handleAddField} type="button">
              Add Field
            </Button>
            <Button color="primary-bordered" onClick={onSaveTemplate} type="button">
              Save Template
            </Button>
            <Button color="primary-bordered" onClick={handleDeleteTemplate} type="button" disabled={!selectedTemplate}>
              Delete Template
            </Button>
          </div>

          <SaveTemplateModal
            modalIsOpen={modalIsOpen}
            handleClose={() => setModalIsOpen(false)}
            handleConfirm={handleSaveTemplate}
            selectedTemplate={selectedTemplate}
          />
        </>
      )}
    </>
  );
};

export default CustomFields;
