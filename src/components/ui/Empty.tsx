import Icon from './Icon';

type Props = {
  text?: any;
};

const Empty = ({ text }: Props) => {
  return (
    <div className="flex justify-center items-center h-full text-center my-12 text-gray-300">
      <div>
        <Icon type="faFolder" className="text-4xl mb-2" />
        <div>{text || 'No Data'}</div>
      </div>
    </div>
  );
};

export default Empty;
