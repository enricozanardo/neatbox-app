import LogInButton from 'components/layout/LogInButton';
import { useNavigate } from 'react-router-dom';

import Button from './Button';

const Error = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="text-center">
        <h1 className="mb-2">Error</h1>
        <p className="mb-6">Whoops! Something went wrong.</p>

        <div className="flex gap-4 justify-center">
          <Button onClick={goBack} color="primary-bordered">
            Go Back
          </Button>

          <LogInButton />
        </div>
      </div>
    </div>
  );
};

export default Error;
