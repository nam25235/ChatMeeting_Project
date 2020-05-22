const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");

const {
  addUser,
  removeUser,
  getUser,
  getUserInRoom,
} = require("./utils/users");
const { userinfo_config, talkto_dialogflow } = require("./dialogflow_connect");

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
  socket.on("join", async ({ name, room }, callback) => {
    // init userinfomation to be able to talk to dialogflow
    const check_message = await userinfo_config(socket.id, room);
    if (!check_message) {
      return;
    } else console.log(check_message);

    // add this new user to system
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return callback(error);
    socket.join(user.room);

    // -- everyone browser panel excep this user
    socket.broadcast.to(user.room).emit("message", {
      user: BOT_NAME,
      text: `${user.username} has joined!`,
    });

    // update 'all people online' infomation in client
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserInRoom(user.room),
    });

    callback();
  });

  // listen sendMessage event of this user message
  socket.on("sendMessage", async (message, callback) => {
    const user = getUser(socket.id);

    // broadcast one user message to other user
    io.to(user.room).emit("message", { user: user.username, text: message });

    // submit free date/time to dialogflow
    const bot_response = await talkto_dialogflow(message, "th");
    if (bot_response != "fallback") {
      if (message != "คำนวนเวลา" && message != "หาเวลาว่างให้หน่อย") {
        socket.emit("message", {
          user: BOT_NAME,
          text: `${bot_response}`,
        });
      } else {
        io.to(user.room).emit("message", {
          user: BOT_NAME,
          text: `${bot_response}`,
        });
      }
    }

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
