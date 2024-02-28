import { useNavigate } from 'react-router-dom';

import Button from 'components/ui/Button';
import SEO from 'components/ui/SEO';

const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-full">
      <SEO pageTitle="403" pageDescription="403 - Forbidden" />

      <div className="text-center space-y-4">
        <h1>403 - Forbidden</h1>
        <p className="mb-4">Whoops! Please register a username to view this page.</p>
        <Button onClick={() => navigate('/register')}>Register Username</Button>
      </div>
    </div>
  );
};

export default ForbiddenPage;
