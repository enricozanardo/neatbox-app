import { useEffect } from 'react';

import { clientIsOnline } from 'services/api';
import { useClientStatusStore } from 'stores/useClientStatusStore';

const ClientStatusFetcher = () => {
  const { updateStatus } = useClientStatusStore();

  useEffect(() => {
    const setStatus = async () => {
      const isOnline = await clientIsOnline();
      updateStatus(isOnline);
    };

    const id = setInterval(setStatus, 10000);
    setTimeout(setStatus, 2500);

    return () => {
      clearInterval(id);
    };
  }, [updateStatus]);

  return null;
};

export default ClientStatusFetcher;
