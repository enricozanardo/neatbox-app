import { useAuth0 } from '@auth0/auth0-react';
import { useAccountMapEntry } from 'hooks/useAccountMapEntry';
import { useWalletStore } from 'stores/useWalletStore';

import AlreadyRegistered from './AlreadyRegistered';
import RegisterForm from './RegisterForm';

const Register = () => {
  const { user } = useAuth0();
  const { wallet } = useWalletStore();
  const { map } = useAccountMapEntry(user?.email);

  if (wallet || map) {
    return <AlreadyRegistered />;
  }

  return <RegisterForm />;
};

export default Register;
