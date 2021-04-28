const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require("cors");
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SERVER IS UP");
});

app.post("/webhook", (req, res) => res.sendStatus(200));

app.post("/api/iotdata", (req, res) => {
  console.log(req.body);
  const { temp, humid, light, rain } = req.body;
  io.sockets.emit("temp", temp);
  io.sockets.emit("humid", humid);
  io.sockets.emit("light", light);
  io.sockets.emit("rain", rain);
  res.send("OK");
});

server.listen(PORT, () => console.log("Server has started !"));

io.on("connection", (socket) => {
  socket.emit("temp", 0);
  socket.emit("humid", 0);
  socket.emit("light", 0);
  socket.emit("rain", 0);
});
