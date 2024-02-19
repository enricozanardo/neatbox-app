import { CustomField } from 'components/upload/CustomFields';

export const validateCustomFields = (data: unknown) => {
  if (!Array.isArray(data)) {
    throw Error('Input is not an array');
  }

  // Remove empty entries
  // Note: empty entries shouldn't be allowed at all
  const filtered = data.filter(field => field?.name && field?.value);

  if (
    filtered.every(entry => typeof entry === 'object') &&
    !filtered.every((entry: Record<string, string>) => entry.name && entry.value)
  ) {
    throw Error('Array entries are not of Custom Field type');
  }

  return filtered as CustomField[];
};
