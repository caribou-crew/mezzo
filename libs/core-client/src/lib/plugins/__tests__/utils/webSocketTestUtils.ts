import * as http from 'http';
import mezzoClient from '../../../core-client';
import createWebSocketServer from './createWebSocketServer';

function startServer(port: number) {
  const server = http.createServer();
  createWebSocketServer(server);
  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

function waitForSocketState(
  client: ReturnType<typeof mezzoClient>,
  targetState: number
) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      // console.log(
      //   `Current state: ${client.getReadyState()}, target: ${targetState}`
      // );
      if (client.getReadyState() === targetState) {
        resolve('');
      } else {
        waitForSocketState(client, targetState).then(resolve);
      }
    }, 5);
  });
}

export { startServer, waitForSocketState };
