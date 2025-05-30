import { Server, Socket } from "socket.io";

export const serverRooms = (socket: Socket, io: Server) => {
  socket.on('leaveRoom', (room: string) => {
    socket.leave(room);
    io.emit('leftRoom', {
      socketId: socket.id,
      room: room
    });

    const getSocketRooms = [...socket.rooms];
    getSocketRooms.shift()

    socket.emit('socketRooms', getSocketRooms);
  })

  socket.on('joinRoom', (room: string) => {
    socket.join(room);

    const getSocketRooms = [...socket.rooms];
    getSocketRooms.shift()

    io.emit('joinedRoom', {
      socketId: socket.id,
      room: room,
      socketRooms: getSocketRooms
    });
  })

  socket.on('sendRoomMessage', (data: { message: string; rooms: string[] }) => {
    io.to(data.rooms).emit('getRoomMessage', {
      id: socket.id,
      message: data.message,
      rooms: data.rooms
    });
  })
}
