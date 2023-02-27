import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AccountProps } from 'types';

const useAccountData = () => {
  const { data } = useQuery<AccountProps>({ queryKey: ['account'], staleTime: 10000 });
  const account = data;

  const removeRequests = (ids: string[]) => {
    // client.setQueryData<AccountProps>(['account'], oldAccount => {
    //   if (!oldAccount) {
    //     return oldAccount;
    //   }
    //   const updatedAccount = { ...oldAccount };
    //   updatedAccount.storage.incomingFileRequests = updatedAccount.storage.incomingFileRequests.filter(
    //     r => !ids.includes(r.requestId),
    //   );
    //   updatedAccount.storage.outgoingFileRequests = updatedAccount.storage.outgoingFileRequests.filter(
    //     r => !ids.includes(r.requestId),
    //   );
    //   updatedAccount.storage.incomingCollectionRequests = updatedAccount.storage.incomingCollectionRequests.filter(
    //     r => !ids.includes(r.requestId),
    //   );
    //   updatedAccount.storage.outgoingCollectionRequests = updatedAccount.storage.outgoingCollectionRequests.filter(
    //     r => !ids.includes(r.requestId),
    //   );
    // });
  };

  return { account, removeRequests };
};

export default useAccountData;
