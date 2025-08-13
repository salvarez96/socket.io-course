// process.env.DEBUG = 'socket.io-parser, socket.io:client, socket.io:namespace, socket.io:socket';

import dotenv from 'dotenv';
import express from 'express';
import { createServer, get } from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { serverRooms } from './serverRooms';
import { ServerNamespaces } from './serverNamespaces';
import { instrument } from '@socket.io/admin-ui';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['https://admin.socket.io'],
    credentials: true
  }
});

instrument(io, {
  auth: {
    type: 'basic',
    username: process.env.ADMIN_USERNAME as string,
    password: process.env.ADMIN_PASSWORD as string
  }
})

app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/rooms', (req, res) => {
  res.sendFile(__dirname + '/views/rooms.html');
});

app.get('/namespaces', (req, res) => {
  res.sendFile(__dirname + '/views/namespaces.html');
});

io.use((socket, next) => {
  const { token } = socket.handshake.auth;
  if (token === 'my-auth-token')
    next();
  else
    next(new Error('Authentication error'));
})

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected!`);
  io.emit('userConnected', `User ${socket.id} connected!`);

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected!`);
    io.emit('userDisconnected', `User ${socket.id} disconnected!`);
  });

  socket.emit('firstConnection', 'Hello world!');

  socket.on('pongMessage', (msg) => {
    console.log(`Client ${socket.id} message: '${msg}'`);
    io.emit('everyone', {
      id: socket.id,
      message: msg
    });
  })

  socket.on('circlePosition', (position) => {
    socket.broadcast.emit('moveCircle', position);
  })

  serverRooms(socket, io);
});

const serverNamespaces = new ServerNamespaces(io);
serverNamespaces.connectTeachersNamespace();
serverNamespaces.connectStudentsNamespace();

httpServer.listen(3000, () => {
  console.log('listening on *:3000');
});
