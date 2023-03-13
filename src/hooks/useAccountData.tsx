import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AccountProps } from 'types';
import { devLog } from 'utils/helpers';

const useAccountData = () => {
  const queryClient = useQueryClient();

  const { data, dataUpdatedAt } = useQuery<AccountProps>({ queryKey: ['account'], staleTime: 10000 });

  const removeRequests = (ids: string[]) => {
    queryClient.setQueryData<AccountProps>(['account'], oldAccount => {
      if (!oldAccount) {
        return oldAccount;
      }

      const updatedAccount = { ...oldAccount };

      updatedAccount.storage.incomingFileRequests = updatedAccount.storage.incomingFileRequests.filter(
        r => !ids.includes(r.requestId),
      );
      updatedAccount.storage.outgoingFileRequests = updatedAccount.storage.outgoingFileRequests.filter(
        r => !ids.includes(r.requestId),
      );
      updatedAccount.storage.incomingCollectionRequests = updatedAccount.storage.incomingCollectionRequests.filter(
        r => !ids.includes(r.requestId),
      );
      updatedAccount.storage.outgoingCollectionRequests = updatedAccount.storage.outgoingCollectionRequests.filter(
        r => !ids.includes(r.requestId),
      );

      return updatedAccount;
    });
  };

  const removeAccountCache = () => {
    devLog('removing');
    queryClient.removeQueries({ queryKey: ['account'], exact: true });
  };

  return { account: data, removeRequests, dataUpdatedAt, removeAccountCache };
};

export default useAccountData;
