import { CustomField } from 'components/upload/CustomFields';

export const validateCustomFields = (data: unknown) => {
  if (!Array.isArray(data)) {
    throw Error('Input is not an array');
  }

  if (
    data.every(entry => typeof entry === 'object') &&
    !data.every((entry: Record<string, string>) => entry.name && entry.value)
  ) {
    throw Error('Array entries are not of Custom Field type');
  }

  return data as CustomField[];
};
