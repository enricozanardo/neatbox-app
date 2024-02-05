import { create } from 'zustand';

type ClientStatusStoreState = {
  clientIsOnline: boolean | null;
  updateStatus: (value: boolean) => void;
};

export const useClientStatusStore = create<ClientStatusStoreState>(set => ({
  clientIsOnline: null,
  updateStatus: clientIsOnline => set(() => ({ clientIsOnline })),
}));
