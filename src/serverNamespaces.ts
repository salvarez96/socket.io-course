import { Namespace, Server, Socket } from "socket.io";
import { ServerIo } from "./interfaces";
import { MessageHandler } from "./messageHandler";

enum USER_TYPE {
  'TEACHER' = 'teacher',
  'STUDENT' = 'student'
}

export class ServerNamespaces extends MessageHandler implements ServerIo {
  io: Server

  constructor(io: Server) {
    super()
    this.io = io
  }

  connectTeachersNamespace() {
    const userType = USER_TYPE.TEACHER
    const teachersNamespace = this.io.of('/teachers')

    teachersNamespace.on('connect', (socket) => {
      this.userConnected(socket, userType)
      this.handleMessage(socket, teachersNamespace)
    });
  }

  connectStudentsNamespace() {
    const userType = USER_TYPE.STUDENT
    const studentsNamespace = this.io.of('/students')

    studentsNamespace.on('connect', (socket) => {
      this.userConnected(socket, userType)
      this.handleMessage(socket, studentsNamespace)
    });
  }
}
