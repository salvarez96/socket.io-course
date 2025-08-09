import { Namespace, Socket } from "socket.io";

export class MessageHandler {
  protected userConnected(socket: Socket, userType: string) {
    socket.on('userConnected', (user) => {
      console.log(`${userType} ${user} connected with ID: ${socket.id}`);
    });
  }

  protected handleMessage(socket: Socket, namespace: Namespace) {
    socket.on('pingMessage', (msg) => {
      namespace.emit('pongMessage', msg);
    });
  }
}