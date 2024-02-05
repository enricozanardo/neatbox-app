import Spinner from 'components/ui/Spinner';

const LoadingPage = () => {
  return (
    <div className="flex justify-center items-center h-full mt-4 mb-10 ">
      <div className="text-center">
        <h1 className="text-4xl text-gray-400">
          <Spinner />
        </h1>
      </div>
    </div>
  );
};

export default LoadingPage;
