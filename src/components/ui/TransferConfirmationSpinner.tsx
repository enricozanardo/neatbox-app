import Spinner from './Spinner';

const TransferConfirmationSpinner = () => {
  return (
    <div className="w-full text-center my-8">
      <p className="text-sm text-gray-400">
        Finalizing transfer
        <span className="ml-2">
          <Spinner />
        </span>
      </p>
    </div>
  );
};

export default TransferConfirmationSpinner;
