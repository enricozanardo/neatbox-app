import { getClasses } from 'utils/helpers';

type Props = {
  text?: string;
  className?: string;
};

const Hr = ({ text, className }: Props) => {
  if (!text) {
    return (
      <div className={getClasses('relative flex py-5 items-center', className)}>
        <div className="flex-grow border-t border-gray-300" />
      </div>
    );
  }

  return (
    <div className={getClasses('relative flex py-5 items-center', className)}>
      <div className="flex-grow border-t border-gray-300" />
      <span className="flex-shrink mx-4 text-gray-300 text-xs">{text}</span>
      <div className="flex-grow border-t border-gray-300" />
    </div>
  );
};

export default Hr;
