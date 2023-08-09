import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AccountProps } from 'types';
import { removeAccountCache, removeRequests } from 'utils/cache';

const useAccountData = () => {
  const queryClient = useQueryClient();
  const { data, dataUpdatedAt } = useQuery<AccountProps>({ queryKey: ['account'], staleTime: 10000 }); // Todo: utilize something other then useQuery to access cache

  const handleRemoveRequests = (ids: string[]) => {
    removeRequests(queryClient, ids);
  };

  const handleRemoveAccountCache = () => {
    removeAccountCache(queryClient);
  };

  return {
    account: data,
    dataUpdatedAt,
    removeRequests: handleRemoveRequests,
    removeAccountCache: handleRemoveAccountCache,
  };
};

export default useAccountData;
