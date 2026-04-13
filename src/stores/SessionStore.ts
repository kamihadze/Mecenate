import { makeAutoObservable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'mecenate.session.userId';

const generateUuid = (): string => {
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex: string[] = [];
  for (let i = 0; i < 16; i++) hex.push(bytes[i].toString(16).padStart(2, '0'));
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
};

export class SessionStore {
  userId: string | null = null;
  isReady = false;

  constructor() {
    makeAutoObservable(this);
  }

  get token(): string | null {
    return this.userId;
  }

  async hydrate(): Promise<void> {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const userId = stored ?? generateUuid();
    if (!stored) await AsyncStorage.setItem(STORAGE_KEY, userId);
    runInAction(() => {
      this.userId = userId;
      this.isReady = true;
    });
  }
}
