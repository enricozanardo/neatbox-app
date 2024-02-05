import { useEffect, useState } from 'react';
import { clientIsOnline } from 'services/api';

export const useClientStatus = () => {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const updateStatus = async () => {
      const isOnline = await clientIsOnline();
      setOnline(isOnline);
    };

    const id = setInterval(updateStatus, 10000);
    setTimeout(updateStatus, 2500);

    return () => {
      clearInterval(id);
    };
  }, []);

  return { clientIsOnline: online };
};
