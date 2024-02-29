import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

import requestsLocation from 'assets/img/requests-location.png';
import LogInButton from 'components/layout/LogInButton';
import useAccountData from 'hooks/useAccountData';

const Welcome = () => {
  const { isAuthenticated } = useAuth0();
  const { account } = useAccountData();
  const accountExists = !!account?.emailHash;

  return (
    <div className="flex justify-center items-center h-full">
      <div className="text-center">
        {isAuthenticated && accountExists && (
          <>
            <h1>Welcome back!</h1>
            <p className="mt-4 mb-4">
              You're already signed up, so <Link to="/upload">start uploading</Link>! :)
            </p>
          </>
        )}

        {(!isAuthenticated || !accountExists) && (
          <>
            <h1>Welcome to Neatbox!</h1>
            <p className="mt-4 mb-4">Follow these steps to access your files:</p>
            <div className="flex justify-center my-8">
              <div>
                <ul className="list-decimal text-left">
                  <li>Sign up via the login button</li>
                  <li>Go through the registration process</li>
                  <li>Accept the transfer on the requests page</li>
                </ul>

                <div className="flex justify-center">
                  <img
                    src={requestsLocation}
                    alt="Requests Location"
                    className="shadow-sm border rounded-lg border-gray-200 my-6 h-32"
                  />
                </div>
              </div>
            </div>
            <LogInButton />
          </>
        )}
      </div>
    </div>
  );
};

export default Welcome;
