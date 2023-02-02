import { useAuth0 } from '@auth0/auth0-react';
import Button from 'components/ui/Button';

const LogInButton = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const handleLogIn = () => {
    loginWithRedirect();
  };

  const handleLogOut = () => {
    logout({ returnTo: `${window.location.origin}?logout=true` });
  };

  if (isAuthenticated) {
    return (
      <Button color="primary" onClick={handleLogOut}>
        Log Out
      </Button>
    );
  }

  return (
    <Button color="primary" onClick={handleLogIn}>
      Log In
    </Button>
  );
};

export default LogInButton;
