// this file is starting point.
require("./db/mongoose");
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

// automatically parse incoming json to req object.
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome");
});

app.listen(port, () => {
  console.log("Server is up on " + port);
});
