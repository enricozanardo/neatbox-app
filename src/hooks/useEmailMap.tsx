import { useEffect, useState } from 'react';

import { fetchMapByEmailOrUsername } from 'services/api';
import { MapStoreData } from 'types';
import { hashEmail } from 'utils/crypto';

export const useEmailMap = (email?: string) => {
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState<MapStoreData | null>();

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }

    const emailHash = hashEmail(email);

    const fetchData = async () => {
      const data = await fetchMapByEmailOrUsername({ email: emailHash });
      setMap(data);
      setLoading(false);
    };

    fetchData();
  }, [email]);

  return { map, loading };
};
