import express from 'express';
import morgan from 'morgan';
import websockets from './customWS.mjs';

const app = express();
// const wss = new WebSocket.Server({ port: '8080' });
app.use(morgan('dev'));
const server = app.listen(3001, () => {
  console.log('Server Started');
  if (process.send) {
    process.send(`Server running at http://localhost:${3001}\n\n`);
  }
});

websockets(server);

process.on('message', (message) => {
  console.log(message);
});

// wss.on('connection', (ws) => {
//   console.log('A new client connected');
//   ws.on('message', (data) => {
//     console.log('This is the data', data.toString());
//   });
// });