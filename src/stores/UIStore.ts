import { makeAutoObservable } from 'mobx';

export class UIStore {
  forceError = false;
  lastErrorMessage: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  triggerError() {
    this.forceError = true;
  }

  clearError() {
    this.forceError = false;
  }

  reportError(message: string) {
    this.lastErrorMessage = message;
  }

  dismissError() {
    this.lastErrorMessage = null;
  }
}
