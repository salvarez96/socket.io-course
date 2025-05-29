const statusSpan = document.querySelector('#statusSpan');
const messageInput = document.querySelector('#messageInput');
const sendMessageButton = document.querySelector('#sendMessageButton');
const connectButton = document.querySelector('#connectButton');
const disconnectButton = document.querySelector('#disconnectButton');
const socket = io();

connectButton.addEventListener('click', () => socket.connect());
disconnectButton.addEventListener('click', () => socket.disconnect());

socket.on('connect', () => {
  console.log(`Socket connected with ID: ${socket.id}`);
  statusSpan.textContent = 'Connected';
});

socket.on('disconnect', (reason) => {
  if (socket.active) {
    statusSpan.textContent = 'Connecting...';
    console.log('Socket disconnected, trying to reconnect...');
  } else {
    statusSpan.textContent = 'Disconnected';
    console.log(`Socket disconnected, reason: ${reason}`);
  }
});

let reconnectionAttempts = 0

socket.io.on('reconnect_attempt', () => {
  statusSpan.textContent = 'Connection lost. Reconnecting...';
  console.log('Socket reconnecting attempts: ', ++reconnectionAttempts);

  if (reconnectionAttempts > 3) {
    socket.disconnect();
    console.log('Socket disconnected after 5 attempts');
    statusSpan.textContent = 'Disconnected. Connection lost';
  }
})

socket.io.on('reconnect', () => {
  console.log(`Socket reconnected after ${reconnectionAttempts} attempts`);
  statusSpan.textContent = 'Connected';
  reconnectionAttempts = 0
})

socket.once('firstConnection', (msg) => {
  console.log(msg);
});

const sendMessage = () => {
  socket.emit('pongMessage', messageInput.value);
  console.log('Message sent!');
};

socket.on('userConnected', (msg) => {
  console.log(msg);
});

socket.on('userDisconnected', (msg) => {
  console.log(msg);
});

socket.on('everyone', (msg) => {
  console.log(`User ${msg.id} says: ${msg.message}`);
});

messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && messageInput.value)
    sendMessage();
});

sendMessageButton.addEventListener('click', sendMessage);
