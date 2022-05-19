export default function connectionManager(path: string) {
  const ws = new WebSocket(path);
  return {
    // send: ws.send,
    // close: ws.close,
    send: function send(payload) {
      ws.send(payload);
    },
    close: function close() {
      console.log(
        '[interceptor-react-native.connectionManager close] RN socket close'
      );
      ws.close();
    },
    set onopen(cb: () => void) {
      ws.onopen = cb;
    },
    set onclose(cb: () => void) {
      ws.onclose = cb;
    },
    set onmessage(cb: () => void) {
      ws.onmessage = cb;
    },
  };
}
