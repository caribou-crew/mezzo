import * as http from 'http';
import createWebSocketServer from './createWebSocketServer';
// import * as WebSocket from 'ws';

function startServer(port) {
  const server = http.createServer();
  createWebSocketServer(server);
  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

function waitForSocketState(socket, state) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      if (socket.readyState === state) {
        resolve('');
      } else {
        waitForSocketState(socket, state).then(resolve);
      }
    }, 5);
  });
}

// async function createSocketClient(port, closeAfter) {
//   const client = new WebSocket(`ws://localhost:${port}`);
//   await waitForSocketState(client, client.OPEN);
//   const messages = [];
//   client.on('message', (data) => {
//     messages.push(data);
//     if (messages.length === closeAfter) {
//       client.close();
//     }
//   });
//   return [client, messages];
// }

// export { startServer, waitForSocketState, createSocketClient };
export { startServer, waitForSocketState };

// import * as WebSocket from 'ws';
// import { Server } from 'http';

// interface Data {
//   type:
//     | 'ECHO'
//     | 'ECHO_TIMES_3'
//     | 'ECHO_TO_ALL'
//     | 'CREATE_GROUP'
//     | 'JOIN_GROUP'
//     | 'MESSAGE_GROUP';
//   value: any;
// }

// interface AugmentedWebSocket extends WebSocket {
//   groupName: string;
// }

// const groupNames: string[] = [];

// /**
//  * Creates a WebSocket server from a Node http server. The server must
//  * be started externally.
//  * @param server The http server from which to create the WebSocket server
//  */
// function createWebSocketServer(server: Server): void {
//   const wss = new WebSocket.Server({ server });

//   wss.on('connection', function (webSocket: AugmentedWebSocket) {
//     webSocket.on('message', function (message) {
//       const data: Data = JSON.parse(message as string);

//       switch (data.type) {
//         case 'ECHO': {
//           webSocket.send(data.value);
//           break;
//         }
//         case 'ECHO_TIMES_3': {
//           for (let i = 1; i <= 3; i++) {
//             webSocket.send(data.value);
//           }
//           break;
//         }
//         case 'ECHO_TO_ALL': {
//           wss.clients.forEach((ws) => ws.send(data.value));
//           break;
//         }
//         case 'CREATE_GROUP': {
//           const groupName = data.value;

//           if (!groupNames.find((gn) => gn === groupName)) {
//             groupNames.push(groupName);
//             webSocket.groupName = groupName;
//             webSocket.send(groupName);
//           } else {
//             webSocket.send('GROUP_UNAVAILABLE');
//           }

//           break;
//         }
//         case 'JOIN_GROUP': {
//           const groupName = data.value;

//           if (!groupNames.find((gn) => gn === groupName)) {
//             webSocket.send('GROUP_UNAVAILABLE');
//           } else {
//             webSocket.groupName = groupName;
//             webSocket.send(groupName);
//           }

//           break;
//         }
//         case 'MESSAGE_GROUP': {
//           const { groupName, groupMessage } = data.value;
//           if (webSocket.groupName !== groupName) break;

//           wss.clients.forEach((ws: AugmentedWebSocket) => {
//             if (ws.groupName === groupName) ws.send(groupMessage);
//           });

//           break;
//         }
//       }
//     });
//   });
// }

// export default createWebSocketServer;
