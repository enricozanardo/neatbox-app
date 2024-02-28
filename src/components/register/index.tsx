import { useAuth0 } from '@auth0/auth0-react';
import Unauthorized from 'components/ui/Unauthorized';

import { useEmailMap } from 'hooks/useEmailMap';

import AlreadyRegistered from './AlreadyRegistered';
import RegistrationProcess from './RegistrationProcess';

const Register = () => {
  const { user } = useAuth0();
  const { map } = useEmailMap(user?.email);

  if (map?.username) {
    return <AlreadyRegistered />;
  }

  if (!user?.email) {
    return <Unauthorized />;
  }

  return <RegistrationProcess email={user.email} />;
};

export default Register;
