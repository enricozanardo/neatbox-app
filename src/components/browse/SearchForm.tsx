import Toggle from 'components/ui/Toggle';
import { Filters } from 'types';

const mimeOptions = [
  { type: 'application', label: 'Application' },
  { type: 'audio', label: 'Audio' },
  { type: 'font', label: 'Font' },
  { type: 'image', label: 'Image' },
  { type: 'model', label: 'Model' },
  { type: 'text', label: 'Text' },
  { type: 'video', label: 'Video' },
];

const sortOptions = [
  { type: 'date:asc', label: 'Created Date -  Ascending' },
  { type: 'date:desc', label: 'Created Date - Descending' },
  { type: 'size:asc', label: 'File Size - Ascending' },
  { type: 'size:desc', label: 'File Size - Descending' },
];

type Props = { filters: Filters; setFilters: React.Dispatch<React.SetStateAction<Filters>> };

const SearchForm = ({ filters, setFilters }: Props) => {
  const handleChange = (type: keyof typeof filters, value: string | boolean) => {
    setFilters(prevState => ({ ...prevState, [type]: value }));
  };

  return (
    <div className="flex flex-col gap-4 mb-16">
      <div className="flex">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>

          <input
            type="search"
            value={filters.searchInput}
            onChange={e => handleChange('searchInput', e.target.value)}
            className="base-input pl-10"
            placeholder="Search for file or collection name"
            required
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block">
            <select
              className="base-input"
              placeholder="Select a type"
              value={filters.mimeType}
              onChange={e => handleChange('mimeType', e.target.value)}
            >
              <option value="" className="text-gray-400">
                All file types
              </option>

              {mimeOptions.map(t => (
                <option value={t.type} key={t.type}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="w-1/2">
          <label className="block">
            <select
              className="base-input"
              placeholder="Select a type"
              value={filters.sortType}
              onChange={e => handleChange('sortType', e.target.value)}
            >
              <option value="" disabled>
                Sort by
              </option>

              {sortOptions.map(option => (
                <option value={option.type} key={option.type}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="flex gap-2">
        <label>
          <Toggle
            isChecked={filters?.isUpdated !== undefined ? filters.isUpdated : false}
            onCheck={() => handleChange('isUpdated', filters.isUpdated !== undefined ? !filters.isUpdated : false)}
          />
        </label>
        <span>Updated files</span>
      </div>
    </div>
  );
};

export default SearchForm;
