import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import websockets, { broadcast } from './customWS.mjs';

const app = express();
// const wss = new WebSocket.Server({ port: '8080' });
app.use(morgan('dev'));
app.use(
  cors({
    origin: ['http://localhost:5173', /\.vercel\.app$/, '*'],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(3001, () => {
  console.log('Server Started');
  if (process.send) {
    process.send(`Server running at http://localhost:${3001}\n\n`);
  }
});

websockets(server);

app.post('/iot', (req, res) => {
  const { message, data } = req.body;
  const sendableData = JSON.stringify({ message, data });
  console.log(sendableData);
  broadcast(sendableData);
  res.status(200).send('Data sent successfully');
});

process.on('message', (message) => {
  console.log(message);
});

// wss.on('connection', (ws) => {
//   console.log('A new client connected');
//   ws.on('message', (data) => {
//     console.log('This is the data', data.toString());
//   });
// });
