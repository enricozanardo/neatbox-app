import { useAuth0 } from '@auth0/auth0-react';
import LogInButton from 'components/layout/LogInButton';
import config from 'config';
import { Link } from 'react-router-dom';

const Welcome = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="flex justify-center items-center h-full">
      <div className="text-center">
        {isAuthenticated && (
          <>
            <h1>Welcome back!</h1>
            <p className="mt-4 mb-4">
              You've already signed up, so <Link to="/upload">start uploading</Link>! :)
            </p>
          </>
        )}

        {!isAuthenticated && (
          <>
            <h1>Welcome to Neatbox!</h1>
            <p className="mt-4 mb-4">Follow these steps to access your files:</p>
            <div className="flex justify-center my-8">
              <ul className="list-decimal text-left">
                <li>Sign up via the login button</li>
                <li>Create or import a wallet</li>
                <li>
                  Get some tokens from the{' '}
                  <a href={config.FAUCET} target="_blank" rel="noreferrer">
                    faucet
                  </a>
                </li>
                <li>Lock the wallet to your account</li>
                <li>
                  Accept the transfer on the <Link to="/requests">requests</Link> page{' '}
                </li>
              </ul>
            </div>
            <LogInButton />
          </>
        )}
      </div>
    </div>
  );
};

export default Welcome;
