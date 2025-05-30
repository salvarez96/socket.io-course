const socket = io()

const sendMessageButton = document.querySelector('#sendMessageButton');
const roomConnectionStatus = document.querySelector('#roomConnectionStatus');
const joinRoom1 = document.querySelector('#joinRoom1');
const joinRoom2 = document.querySelector('#joinRoom2');
const joinRoom3 = document.querySelector('#joinRoom3');

let roomsJoined = []

const handleRoomButtons = (element, roomNumber, hasMetadata) => {
  if (hasMetadata) {
    socket.emit('leaveRoom', `room${roomNumber}`);
    element.innerHTML = `Join room ${roomNumber}`
    element.metadata = ''
  } else {
    element.innerHTML = `Leave room ${roomNumber}`
    element.metadata = `Leave room ${roomNumber}`
    socket.emit('joinRoom', `room${roomNumber}`);
  }
}

const handleRoomState = (hasUserJoined, data) => {
  const li = document.createElement('li');

  if (hasUserJoined) {
    li.textContent = data.socketId === socket.id
      ? `You joined ${data.room}`
      : `Socket ${data.socketId.slice(0, 5)} joined ${data.room}`
  } else {
    li.textContent = data.socketId === socket.id
      ? `You left ${data.room}`
      : `Socket ${data.socketId.slice(0, 5)} left ${data.room}`
  }
  console.log(li.textContent);
  document.querySelector('#roomConnectionStatus').appendChild(li);

  setTimeout(() => {
    document.querySelector('#roomConnectionStatus').removeChild(li);
  }, 5000)
}

joinRoom1.addEventListener('click', () => {
  handleRoomButtons(joinRoom1, 1, joinRoom1.metadata)
})

joinRoom2.addEventListener('click', () => {
  handleRoomButtons(joinRoom2, 2, joinRoom2.metadata)
})

joinRoom3.addEventListener('click', () => {
  handleRoomButtons(joinRoom3, 3, joinRoom3.metadata)
})

sendMessageButton.addEventListener('click', () => {
  const message = prompt('Write a message to send:');
  socket.emit('sendRoomMessage', {
    rooms: roomsJoined,
    message: message
  });
});

socket.on('joinedRoom', (data) => {
  roomsJoined = data.socketRooms
  handleRoomState(true, data)
})

socket.on('leftRoom', (data) => {
  handleRoomState(false, data)
})

socket.on('socketRooms', (data) => {
  roomsJoined = data
})

socket.on('getRoomMessage', (data) => {
  data.rooms.forEach((room) => {
    const li = document.createElement('li');
    li.textContent = `${data.id.slice(0, 5)} says: ${data.message}`;
    document.querySelector(`#${room}`).appendChild(li);
  })
})