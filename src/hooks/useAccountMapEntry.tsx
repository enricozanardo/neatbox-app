import { useEffect, useState } from 'react';
import { fetchAccountMapEntryByEmailHash } from 'services/api';
import { AccountMapEntry } from 'types';
import { hashEmail } from 'utils/crypto';

export const useAccountMapEntry = (email?: string) => {
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState<AccountMapEntry | undefined>();

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }

    const emailHash = hashEmail(email);

    const fetchData = async () => {
      const data = await fetchAccountMapEntryByEmailHash(emailHash);
      setMap(data);
      setLoading(false);
    };

    fetchData();
  }, [email]);

  return { map, loading };
};
