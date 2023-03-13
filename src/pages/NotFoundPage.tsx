import { useNavigate } from 'react-router-dom';

import Button from '../components/ui/Button';
import SEO from '../components/ui/SEO';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex justify-center items-center h-full">
      <SEO pageTitle="404" pageDescription="404 - Not Found" />

      <div className="text-center space-y-4">
        <h1>404 - Not Found</h1>
        <p className="mb-4">Whoops! This page does not exist.</p>

        <Button onClick={goBack}>Go Back</Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
