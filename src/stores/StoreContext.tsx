import React, { createContext, useContext, useMemo } from 'react';
import { RootStore } from './RootStore';

const StoreContext = createContext<RootStore | null>(null);

interface Props {
  children: React.ReactNode;
  store?: RootStore;
}

export const StoreProvider: React.FC<Props> = ({ children, store }) => {
  const value = useMemo(() => store ?? new RootStore(), [store]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = (): RootStore => {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used within StoreProvider');
  return store;
};

export const useSessionStore = () => useStore().session;
export const useUIStore = () => useStore().ui;
