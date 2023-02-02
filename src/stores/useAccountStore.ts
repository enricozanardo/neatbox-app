import deepEqual from 'deep-equal';
import { AccountProps } from 'types';
import { create } from 'zustand';

type AccountState = {
  account: AccountProps | null;
  ignoreRefresh: boolean;
  update: (updatedAccount: AccountProps | null) => void;
  setIgnoreRefresh: (ignore: boolean) => void;
  removeRequests: (ids: string[]) => void;
};

export const useAccountStore = create<AccountState>(set => ({
  account: null,
  ignoreRefresh: false,
  update: updatedAccount =>
    set(state => {
      if (deepEqual(state.account, updatedAccount)) {
        return state;
      }

      return { account: updatedAccount };
    }),
  setIgnoreRefresh: ignore => set(() => ({ ignoreRefresh: ignore })),
  removeRequests: ids =>
    set(state => {
      if (!state.account) {
        return { account: null };
      }

      const updatedAccount = { ...state.account };

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

      return { account: updatedAccount };
    }),
}));
