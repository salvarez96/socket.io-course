import { Namespace, Server, Socket } from "socket.io";

export class ServerNamespaces {
  io: Server

  constructor(io: Server) {
    this.io = io
  }

  connectTeachersNamespace() {
    const userType = 'Teacher'
    const teachersNamespace = this.io.of('/teachers')

    teachersNamespace.on('connect', (socket) => {
      this.userConnected(socket, userType)
      this.handleMessage(socket, teachersNamespace)
    });
  }

  connectStudentsNamespace() {
    const userType = 'Student'
    const studentsNamespace = this.io.of('/students')

    studentsNamespace.on('connect', (socket) => {
      this.userConnected(socket, userType)
      this.handleMessage(socket, studentsNamespace)
    });
  }

  private userConnected(socket: Socket, userType: string) {
    socket.on('userConnected', (user) => {
      console.log(`${userType} ${user} connected with ID: ${socket.id}`);
    });
  }

  private handleMessage(socket: Socket, namespace: Namespace) {
    socket.on('pingMessage', (msg) => {
      namespace.emit('pongMessage', msg);
    });
  }
}
