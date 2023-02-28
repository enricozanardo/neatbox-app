import { useQuery } from '@tanstack/react-query';
import { fetchUser } from 'services/api';
import { Wallet } from 'types';
import { devLog, generateDefaultAccount } from 'utils/helpers';

export const AccountDataFetcher = ({ wallet }: { wallet: Wallet }) => {
  const { data, status } = useQuery({
    queryKey: ['account'],
    queryFn: () => fetchUser(wallet.binaryAddress).catch(() => generateDefaultAccount(wallet.binaryAddress)),
    refetchInterval: 10000,
    keepPreviousData: true,
    staleTime: 10000,
  });

  devLog(status);
  devLog(data);

  return null;
};
