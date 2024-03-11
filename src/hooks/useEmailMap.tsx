import { useEffect, useState } from 'react';

import { fetchMapByEmailHashOrUsername } from 'services/api';
import { MapStoreData } from 'types';
import { hashEmail } from 'utils/crypto';
import { handleError } from 'utils/errors';

export const useEmailMap = (email?: string) => {
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState<MapStoreData | null>();

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }

    const emailHash = hashEmail(email);

    const fetchData = () => {
      fetchMapByEmailHashOrUsername({ emailHash })
        .then(data => {
          setMap(data);
          setLoading(false);
        })
        .catch(err => handleError(err));
    };

    fetchData();
  }, [email]);

  return { map, loading };
};
