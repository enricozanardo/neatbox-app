import { useEffect, useRef } from 'react';
import { fetchUser } from 'services/api';
import { useAccountStore } from 'stores/useAccountStore';
import { generateDefaultAccount } from 'utils/helpers';

export const useAccountAutoRefresh = (address?: string) => {
  const { update, ignoreRefresh, setIgnoreRefresh } = useAccountStore();

  const ignoreRef = useRef(false);

  ignoreRef.current = ignoreRefresh;

  useEffect(() => {
    if (!address) {
      update(null);
      return;
    }

    const fetchData = () => {
      if (ignoreRef.current) {
        setIgnoreRefresh(false);
        return;
      }

      fetchUser(address)
        .then(data => update(data))
        .catch(() => update(generateDefaultAccount(address))); /** Use 'default' account for non-active accounts */
    };

    fetchData();

    /**
     * Using a setInterval instead of a subscription to the new block event
     * due to the inability to unsubscribe with the current version of the SDK
     */
    const id = setInterval(fetchData, 10000);

    return () => {
      clearInterval(id);
    };
  }, [address, update, setIgnoreRefresh]);

  return null;
};
