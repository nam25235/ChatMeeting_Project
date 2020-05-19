const mongoose = require("mongoose");

mongoose.connect(
  process.argv[2] === "local"
    ? "mongodb://127.0.0.1:27017/meetingchatbot-db"
    : "mongodb://127.0.0.1:27017/meetingchatbot-db",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);
