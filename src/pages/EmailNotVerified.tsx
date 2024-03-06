import LogInButton from 'components/layout/LogInButton';
import SEO from 'components/ui/SEO';

const EmailNotVerified = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <SEO pageTitle="403" pageDescription="403 - Forbidden" />

      <div className="text-center space-y-4">
        <h1>403 - Verify Email</h1>
        <p className="mb-4">Please verify your e-mail and login again to continue.</p>

        <LogInButton />
      </div>
    </div>
  );
};

export default EmailNotVerified;
