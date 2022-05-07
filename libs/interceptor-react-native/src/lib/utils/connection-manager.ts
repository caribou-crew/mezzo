export default class ConnectionManager {
  private webSocket: any;

  constructor(path?: string) {
    console.log('RN socket Connection attempt');
    this.webSocket = new WebSocket(path);
  }

  send(payload: any) {
    if (this.webSocket.readyState === 1) {
      this.webSocket.send(payload);
    }
  }

  on(event: 'open' | 'close' | 'message', callback: any) {
    if (event === 'open') {
      this.webSocket.onopen = callback;
    } else if (event === 'message') {
      this.webSocket.onmessage = (evt) => callback(evt.data);
    }
  }

  close() {
    console.log('RN socket close');
    this.webSocket.close();
  }
}
