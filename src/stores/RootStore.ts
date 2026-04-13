import { SessionStore } from './SessionStore';

export class RootStore {
  session: SessionStore;

  constructor() {
    this.session = new SessionStore();
  }
}
