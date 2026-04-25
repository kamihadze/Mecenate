import { makeAutoObservable, runInAction } from 'mobx';
import { buildWsUrl, parseEvent, WSEvent } from '../api/ws';

type Handler = (event: WSEvent) => void;

const BACKOFF_BASE_MS = 1_000;
const BACKOFF_MAX_MS = 30_000;

export class RealtimeStore {
  isConnected = false;
  private socket: WebSocket | null = null;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private handlers = new Set<Handler>();
  private shouldBeOpen = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  connect(token: string) {
    this.token = token;
    this.shouldBeOpen = true;
    this.openSocket();
  }

  disconnect() {
    this.shouldBeOpen = false;
    this.clearReconnect();
    if (this.socket) {
      this.socket.onclose = null;
      this.socket.close();
      this.socket = null;
    }
    runInAction(() => {
      this.isConnected = false;
    });
  }

  subscribe(handler: Handler): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  private openSocket() {
    if (!this.token || !this.shouldBeOpen) return;
    if (this.socket) {
      this.socket.onclose = null;
      this.socket.close();
    }

    const socket = new WebSocket(buildWsUrl(this.token));
    this.socket = socket;

    socket.onopen = () => {
      runInAction(() => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
      });
    };

    socket.onmessage = (message) => {
      const event = parseEvent(String(message.data));
      if (!event || event.type === 'ping') return;
      for (const handler of this.handlers) handler(event);
    };

    socket.onerror = () => {
      socket.close();
    };

    socket.onclose = () => {
      runInAction(() => {
        this.isConnected = false;
      });
      if (this.shouldBeOpen) this.scheduleReconnect();
    };
  }

  private scheduleReconnect() {
    this.clearReconnect();
    const delay = Math.min(
      BACKOFF_BASE_MS * 2 ** this.reconnectAttempts,
      BACKOFF_MAX_MS,
    );
    this.reconnectAttempts += 1;
    this.reconnectTimer = setTimeout(() => this.openSocket(), delay);
  }

  private clearReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}
