const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require("cors");
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const axios = require("axios");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SERVER IS UP");
  lineBroadcast("SERVER IS UP");
});

app.post("/webhook", (req, res) => {
  let reply_token = req.body.events[0].replyToken;
  let msg = req.body.events[0].message.text;
  if (msg === "now") {
    lineReply(reply_token, "Temp : 23, Humid 23\n It is raining in PSU");
  } else lineReply(reply_token, "IDK");
  res.sendStatus(200);
});

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

const lineToken =
  "KE5kFlm/9DFw9N5ZnR93ND5E0KDklFNJ25rtOE//W79Sj3Rf8gKWkXvwTPpG46cYqCrKs6uhCHUA15McOvVsBH7sqTxC1TI7iliuNcW1t9MZKyllbWJU5yZUZg3UYbZX27HmrVU7bh+IvsdgCqADCgdB04t89/1O/w1cDnyilFU=";

const lineAx = axios.create({
  baseURL: "https://api.line.me/v2/bot/message",
});

function lineReply(reply_token, message) {
  const body = JSON.stringify({
    replyToken: reply_token,
    messages: [
      {
        type: "text",
        text: message,
      },
    ],
  });
  lineAx.defaults.headers.common["Authorization"] = `Bearer {${lineToken}}`;
  lineAx.defaults.headers.post["Content-Type"] = "application/json";
  lineAx.post("/reply", body);
}

function lineBroadcast(message) {
  const body = JSON.stringify({
    messages: [
      {
        type: "text",
        text: message,
      },
    ],
  });
  lineAx.defaults.headers.common["Authorization"] = `Bearer {${lineToken}}`;
  lineAx.defaults.headers.post["Content-Type"] = "application/json";
  lineAx.post("/broadcast", body);
}
