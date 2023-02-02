import { Auth0Provider } from '@auth0/auth0-react';
import config from 'config';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

type Props = {
  children: React.ReactNode | React.ReactNode[];
};

const Authentication = ({ children }: Props) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    toast.success('Successfully logged in!');
    navigate('/dashboard');
  };

  return (
    <Auth0Provider
      domain={config.AUTH0_DOMAIN}
      clientId={config.AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
      onRedirectCallback={handleLogin}
      useRefreshTokens
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};

export default Authentication;
