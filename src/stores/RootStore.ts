import { SessionStore } from './SessionStore';
import { UIStore } from './UIStore';

export class RootStore {
  session: SessionStore;
  ui: UIStore;

  constructor() {
    this.session = new SessionStore();
    this.ui = new UIStore();
  }
}
