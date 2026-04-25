import { RealtimeStore } from './RealtimeStore';
import { SessionStore } from './SessionStore';
import { UIStore } from './UIStore';

export class RootStore {
  session: SessionStore;
  ui: UIStore;
  realtime: RealtimeStore;

  constructor() {
    this.session = new SessionStore();
    this.ui = new UIStore();
    this.realtime = new RealtimeStore();
  }
}
