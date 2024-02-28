import Spinner from 'components/ui/Spinner';

type Props = {
  isLoading?: boolean;
};
const LoadingOverlay = ({ isLoading }: Props) => {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="absolute w-full h-full bg-white bg-opacity-30 z-50">
      <div className="flex justify-center items-center h-full mt-4">
        <Spinner />
      </div>
    </div>
  );
};

export default LoadingOverlay;
