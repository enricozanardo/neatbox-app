import { useAuth0 } from '@auth0/auth0-react';
import Button from 'components/ui/Button';

const Enter = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div>
      <Button onClick={loginWithRedirect}>Log In</Button>
    </div>
  );
};

export default Enter;
