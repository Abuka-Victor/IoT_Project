import WebSocket, { WebSocketServer } from 'ws';
import queryString from 'query-string';

const websocketServer = new WebSocketServer({
  noServer: true,
  path: '/websockets',
});

export function broadcast(data) {
  websocketServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

export default async (expressServer) => {
  expressServer.on('upgrade', (request, socket, head) => {
    websocketServer.handleUpgrade(request, socket, head, (websocket) => {
      websocketServer.emit('connection', websocket, request);
    });
  });

  websocketServer.on(
    'connection',
    function connection(websocketConnection, connectionRequest) {
      const [_path, params] = connectionRequest?.url?.split('?');
      const connectionParams = queryString.parse(params);

      // NOTE: connectParams are not used here but good to understand how to get
      // to them if you need to pass data with the connection to identify it (e.g., a userId).
      console.log(connectionParams);

      websocketConnection.on('message', (message, isBinary) => {
        const parsedMessage = JSON.parse(message);
        console.log(parsedMessage);
        websocketServer.clients.forEach(function each(client) {
          if (
            client !== websocketConnection &&
            client.readyState === WebSocket.OPEN
          ) {
            client.send(JSON.stringify({ message: parsedMessage.message }), {
              binary: isBinary,
            });
          }
        });
        // websocketConnection.send(JSON.stringify({ message: 'My IoT Project' }));
      });
    }
  );

  return websocketServer;
};
