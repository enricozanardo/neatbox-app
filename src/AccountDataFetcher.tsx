import { useQuery } from '@tanstack/react-query';
import useWallet from 'hooks/useWallet';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchUser } from 'services/api';

import { devLog } from 'utils/helpers';

const AccountDataFetcher = () => {
  const { pathname } = useLocation();
  const { wallet } = useWallet();

  const { refetch } = useQuery({
    queryKey: ['account'],
    queryFn: () => (wallet ? fetchUser(wallet.binaryAddress) : null),
    refetchInterval: 10000,
    keepPreviousData: true,
    staleTime: 10000,
    onSuccess: () => devLog('Account data fetched'),
  });

  useEffect(() => {
    devLog('Refetching..');
    refetch();
  }, [wallet, refetch]);

  useEffect(() => {
    if (pathname === '/dashboard') {
      devLog('Refetching..');
      refetch();
    }
  }, [pathname, refetch]);

  return null;
};

export default AccountDataFetcher;
