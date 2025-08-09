import { Server, Socket } from "socket.io";

export interface ServerIo {
  io: Server
}

export interface SocketIo {
  socket: Socket
}