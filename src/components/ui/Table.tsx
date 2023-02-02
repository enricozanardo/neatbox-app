import Empty from './Empty';
import Spinner from './Spinner';

type Props = {
  cols: { key: string; name?: string; renderItem?: (item: any) => any }[];
  data: Record<string, any>[];
  isLoading?: boolean;
};

const Th = ({ children }: { children: React.ReactNode }) => (
  <th scope="col" className="px-6 py-3">
    {children}
  </th>
);

const Td = ({ children }: { children: React.ReactNode }) => <td className="px-6 py-4">{children}</td>;

const Table = ({ cols, data, isLoading }: Props) => {
  const renderLoader = () => {
    if (data.length > 0 && isLoading) {
      return (
        <div className="absolute left-1/2 top-1/2">
          <div className="text-4xl text-gray-200">
            <Spinner />
          </div>
        </div>
      );
    }
  };

  const renderTableBody = () => {
    if (data.length === 0 && !isLoading) {
      return (
        <tr>
          <td colSpan={cols.length + 1} className="h-64">
            <Empty />
          </td>
        </tr>
      );
    }

    return data.map((item, i) => (
      <tr key={`item-${i}-tr`} className={`border-b ${isLoading ? 'opacity-20' : 'opacity-100'}`}>
        {cols.map(({ key, renderItem }, i) => (
          <Td key={`${item[key]}-${i}-td`}>{renderItem ? renderItem(item[key]) : item[key]}</Td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="overflow-x-auto relative">
      {renderLoader()}
      <table className="text-sm text-left text-gray-500 shadow-md">
        <thead className="text-xs text-gray-700 uppercase bg-gray-5 ">
          <tr>
            {cols.map(col => (
              <Th key={col.key}>{col.name || col.key}</Th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white">{renderTableBody()}</tbody>
      </table>
    </div>
  );
};

export default Table;
