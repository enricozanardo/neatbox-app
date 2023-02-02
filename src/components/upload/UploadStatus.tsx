type Props = {
  heading: string;
  progress: number;
};

const UploadStatus = ({ heading, progress }: Props) => {
  return (
    <div className="flex justify-center items-center h-full mt-4 mb-10 ">
      <div className="text-center">
        <h1 className="text-6xl">{progress} %</h1>
        <div className="mt-4 text-gray-500">{progress === 100 ? 'Processing...' : heading}</div>
      </div>
    </div>
  );
};

export default UploadStatus;
