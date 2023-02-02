import Clipboard from 'components/ui/Clipboard';

const DetailBlock = ({ label, value }: { label: string; value: any }) => (
  <div className="text-center mb-4">
    <div>{label}</div>
    <div className="flex justify-center items-center">
      <div className="text-xs text-gray-600 truncate">{value}</div>
      <Clipboard value={value} className="ml-2 mb-1 text-gray-400" />
    </div>
  </div>
);

export default DetailBlock;
