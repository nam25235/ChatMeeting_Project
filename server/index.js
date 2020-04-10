const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");

const { generateMessage } = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUserInRoom,
  getUsers,
} = require("./utils/users");

const BOT_NAME = "BOT";
const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

// io refer to all-connected client
io.on("connect", (socket) => {
  // listen join event
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return callback(error);
    socket.join(user.room);
    // join message from bot
    socket.emit("message", {
      user: BOT_NAME,
      text: `${user.username}, welcome to room ${user.room}.`,
    });
    socket.broadcast.to(user.room).emit("message", {
      user: BOT_NAME,
      text: `${user.username} has joined!`,
    });
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserInRoom(user.room),
    });
    callback();
  });

  // listen sendMessage event
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.username, text: message });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: BOT_NAME,
        text: `${user.username} has left.`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUserInRoom(user.room),
      });
    }
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
