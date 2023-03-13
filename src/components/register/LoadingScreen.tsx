import { useEffect, useState } from 'react';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepSize = 100 / 21 / 4;

    const id = setInterval(() => {
      if (progress > 100) {
        clearInterval(id);
      }

      setProgress(prevState => {
        const updated = prevState + stepSize;
        return updated > 100 ? 100 : Math.round(updated);
      });
    }, 250);

    return () => {
      clearInterval(id);
    };
  }, [progress]);

  return (
    <div className="flex justify-center items-center h-full mt-4 mb-10 ">
      <div className="text-center">
        <h1 className="text-6xl">{progress} %</h1>
        <div className="mt-4 text-gray-500">
          Initializing your account..
          <br />
          This will take between 10 and 20 seconds.
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;