const socket = io();

socket.on('connect', () => {
  console.log(`Socket connected with ID: ${socket.id}`);
});

socket.on('disconnect', (reason) => {
  if (socket.active) {
    console.log('Socket disconnected, trying to reconnect...');
  } else {
    console.log(`Socket disconnected, reason: ${reason}`);
  }
});

let reconnectionAttempts = 0

socket.io.on('reconnect_attempt', () => {
  console.log('Socket reconnecting attempts: ', ++reconnectionAttempts);

  if (reconnectionAttempts > 5) {
    socket.disconnect();
    console.log('Socket disconnected after 5 attempts');
  }
})

socket.io.on('reconnect', () => {
  console.log(`Socket reconnected after ${reconnectionAttempts} attempts`);
  reconnectionAttempts = 0
})

setTimeout(() => {
  socket.disconnect();

  setTimeout(() => {
    socket.connect();
  }, 3000)
}, 3000)
