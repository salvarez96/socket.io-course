import { Server, Socket } from "socket.io";

export class ServerNamespaces {
  io: Server

  constructor(io: Server) {
    this.io = io
  }

  connectTeachersNamespace() {
    const userType = 'Teacher'
    this.io.of('/teachers').on('connect', (socket) => {
      this.userConnected(socket, userType)
    });
  }

  connectStudentsNamespace() {
    const userType = 'Student'
    this.io.of('/students').on('connect', (socket) => {
      this.userConnected(socket, userType)
    });
  }

  private userConnected(socket: Socket, userType: string) {
    socket.on('userConnected', (user) => {
      console.log(`${userType} ${user} connected with ID: ${socket.id}`);
    });
  }
}
