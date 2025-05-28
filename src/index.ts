import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  console.log(socket.id);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

httpServer.listen(3000, () => {
  console.log('listening on *:3000');
});
