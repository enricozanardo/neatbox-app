import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import useWallet from 'hooks/useWallet';
import { fetchAggregatedAccount } from 'services/api';
import { devLog } from 'utils/helpers';

const AccountDataFetcher = () => {
  const { pathname } = useLocation();
  const { wallet } = useWallet();

  const { refetch } = useQuery({
    queryKey: ['account'],
    queryFn: () => (wallet ? fetchAggregatedAccount(wallet.lsk32address) : null),
    refetchInterval: 10000,
    keepPreviousData: true,
    staleTime: 10000,
    onSuccess: () => devLog('Account data fetched'),
  });

  console.log({ wallet });

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
