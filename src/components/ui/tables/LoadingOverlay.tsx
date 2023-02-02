import Spinner from '../Spinner';

type Props = {
  isLoading?: boolean;
};
const LoadingOverlay = ({ isLoading }: Props) => {
  if (!isLoading) {
    return <></>;
  }

  return (
    <div className="absolute w-full h-full bg-white bg-opacity-30">
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    </div>
  );
};

export default LoadingOverlay;
