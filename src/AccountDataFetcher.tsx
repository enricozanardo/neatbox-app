import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchUser } from 'services/api';
import { Wallet } from 'types';
import { devLog } from 'utils/helpers';

export const AccountDataFetcher = ({ wallet }: { wallet: Wallet }) => {
  const { pathname } = useLocation();

  const { refetch } = useQuery({
    queryKey: ['account'],
    queryFn: () => fetchUser(wallet.binaryAddress).catch(() => undefined),
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
