import LogInButton from 'components/layout/LogInButton';

import SEO from '../components/ui/SEO';

const UnauthorizedPage = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <SEO pageTitle="401" pageDescription="401 - Unauthorized" />

      <div className="text-center space-y-4">
        <h1>401 - Unauthorized</h1>
        <p className="mb-4">Whoops! Please log in to view this page.</p>

        <LogInButton />
      </div>
    </div>
  );
};

export default UnauthorizedPage;
