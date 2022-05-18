export default function connectionManager(path: string) {
  const ws = new WebSocket(path);
  return {
    send: ws.send,
    close: ws.close,
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
