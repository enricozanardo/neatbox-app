import { useEffect, useState } from 'react';
import { fetchAccountMapEntryByEmailHash } from 'services/api';
import { AccountMapEntry } from 'types';
import { hashEmail } from 'utils/crypto';

export const useAccountMapEntry = (email?: string) => {
  const [map, setMap] = useState<AccountMapEntry | undefined>();

  useEffect(() => {
    if (!email) {
      return;
    }

    const emailHash = hashEmail(email);

    const fetchData = async () => {
      const data = await fetchAccountMapEntryByEmailHash(emailHash);
      setMap(data);
    };

    fetchData();
  }, [email]);

  return { map };
};
