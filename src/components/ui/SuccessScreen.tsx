import Button from 'components/ui/Button';
import Icon from 'components/ui/Icon';

type Props = { reset: () => void; type: 'Upload' | 'Transfer' };

const SuccessScreen = ({ reset, type }: Props) => {
  const getText = (type: 'Upload' | 'Transfer') => {
    if (type === 'Upload') {
      return 'Upload complete!';
    }

    if (type === 'Transfer') {
      return 'Transfer initiated!';
    }

    return 'Great success!';
  };

  return (
    <div className="flex justify-center items-center h-full mt-4 mb-10 ">
      <div className="text-center">
        <h3 className="mb-2">
          {getText(type)}
          <span className="text-green-400 text-2xl ml-2">
            <Icon type="faCheck" />
          </span>
        </h3>

        <p className="mb-6 text-gray-400">It may take about 10 seconds for the request to be fully processed</p>

        <div className="flex gap-4 justify-center">
          <Button onClick={reset} color="primary-bordered">
            Make another {type}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
