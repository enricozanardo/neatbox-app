import { create } from 'zustand';

type ClientStatusStoreState = {
  clientIsOnline: boolean;
  updateStatus: (value: boolean) => void;
};

export const useClientStatusStore = create<ClientStatusStoreState>(set => ({
  clientIsOnline: false,
  updateStatus: clientIsOnline => set(() => ({ clientIsOnline })),
}));
