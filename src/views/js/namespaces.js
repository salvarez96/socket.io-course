const namespaceSpan = document.querySelector('#namespaceSpan');
const usernameSpan = document.querySelector('#usernameSpan');
const sendMessageButton = document.querySelector('#sendMessage');
const chat = document.querySelector('#chat');

const teachers = ['RetaxMaster', 'juandc', 'GNDX']
const groups = ['teachers', 'students']

const user = prompt('What is your name?');

let socketNamespace, group

if (teachers.includes(user)) {
  group = 'teachers';
  socketNamespace = io('/teachers');
} else {
  group = 'students';
  socketNamespace = io('/students');
}

socketNamespace.on('connect', () => {
  namespaceSpan.textContent = group;
  usernameSpan.textContent = user;
  console.log(`Socket connected with ID: ${socketNamespace.id}`);

  socketNamespace.emit('userConnected', user);
});

sendMessageButton.addEventListener('click', () => {
  const message = prompt('Write a message:');
  socketNamespace.emit('pingMessage', { message, user });
});

socketNamespace.on('pongMessage', ({ user, message }) => {
  const li = document.createElement('li');
  li.textContent = `${user}: ${message}`;
  chat.appendChild(li);
});