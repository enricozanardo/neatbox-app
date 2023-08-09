import { useAuth0 } from '@auth0/auth0-react';
import Redirect from 'components/ui/Redirect';
import Spinner from 'components/ui/Spinner';
import { useAccountMapEntry } from 'hooks/useAccountMapEntry';

const LandingPage = () => {
  const { user } = useAuth0();
  const { map, loading } = useAccountMapEntry(user?.email);

  if (loading) {
    return <Spinner />;
  }

  if (!map) {
    return <Redirect to="/register" />;
  }

  return <Redirect to="/dashboard" />;
};

export default LandingPage;
