import { useQuery } from '@tanstack/react-query';
import { fetchUser } from 'services/api';
import { Wallet } from 'types';
import { devLog } from 'utils/helpers';
import { generateDefaultAccount } from 'utils/mocks';

export const AccountDataFetcher = ({ wallet }: { wallet: Wallet }) => {
  useQuery({
    queryKey: ['account'],
    queryFn: () => fetchUser(wallet.binaryAddress).catch(() => generateDefaultAccount(wallet.binaryAddress)),
    refetchInterval: 10000,
    keepPreviousData: true,
    staleTime: 10000,
    onSuccess: () => devLog('Account data fetched'),
  });

  return null;
};
