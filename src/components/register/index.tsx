import { useAuth0 } from '@auth0/auth0-react';
import Unauthorized from 'components/ui/Unauthorized';
import { useAccountMapEntry } from 'hooks/useAccountMapEntry';

import AlreadyRegistered from './AlreadyRegistered';
import RegistrationProcess from './RegistrationProcess';

const Register = () => {
  const { user } = useAuth0();
  const { map } = useAccountMapEntry(user?.email);

  if (map?.username) {
    return <AlreadyRegistered />;
  }

  if (!user?.email) {
    return <Unauthorized />;
  }

  return <RegistrationProcess email={user.email} />;
};

export default Register;
