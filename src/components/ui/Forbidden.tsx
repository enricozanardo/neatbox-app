import { useNavigate } from 'react-router-dom';

import Button from './Button';

const Forbidden = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="text-center">
        <h1>403 - Forbidden</h1>
        <p>Whoops! You are not allowed to view this page.</p>

        <Button onClick={goBack}>Go Back</Button>
      </div>
    </div>
  );
};

export default Forbidden;
