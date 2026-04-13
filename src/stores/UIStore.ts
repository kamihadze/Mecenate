import { makeAutoObservable } from 'mobx';

export class UIStore {
  forceError = false;

  constructor() {
    makeAutoObservable(this);
  }

  triggerError() {
    this.forceError = true;
  }

  clearError() {
    this.forceError = false;
  }
}
