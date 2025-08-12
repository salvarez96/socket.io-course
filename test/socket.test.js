const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');
const { server } = require('typescript');

describe("Testing Socket.io", () => {

  let io, serverSocket, clientSocket

  beforeAll(done => {
    const httpServer = createServer();
    io = new Server(httpServer);

    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);

      io.on('connection', (socket) => {
        serverSocket = socket
      })

      clientSocket.on('connect', done)
    })
  })

  afterAll(() => {
    io.close()
    clientSocket.close()
  })

  test("Test greeting", done => {
    serverSocket.emit('greeting', "Hello world!")
    clientSocket.on('greeting', greet => {
      try {
        expect(greet).toBe("Hello world!")
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  test("Testing callback acknowledments", done => {
    serverSocket.on("bark", callback => {
      callback("Woof!")
    })

    clientSocket.emit("bark", arg => {
      try {
        expect(arg).toBe("Woof!")
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  test("Test room", done => {
    clientSocket.emit("joinRoom", "room1")

    serverSocket.on("joinRoom", data => {
      serverSocket.join(data)
      serverSocket.emit("joinedRoom", [...serverSocket.rooms][1])
    })

    clientSocket.on("joinedRoom", rooms => {
      try {
        expect(rooms).toContain("room1")
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  test("Room message", done => {
    clientSocket.emit("joinRoom", "room1")
    clientSocket.emit("room1Message", "Hello world!")

    serverSocket.on("joinRoom", data => {
      serverSocket.join(data)
    })

    serverSocket.on("room1Message", msg => {
      io.to("room1").emit("sendRoom1Message", msg)
    })

    clientSocket.on("sendRoom1Message", msg => {
      try {
        expect(msg).toBe("Hello world!")
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})
