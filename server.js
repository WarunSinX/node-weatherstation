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
});

let tempTmp = "0",
  humidTmp = "0",
  rainTmp = "0";

app.post("/webhook", (req, res) => {
  let reply_token = req.body.events[0].replyToken;
  let msg = req.body.events[0].message.text;
  if (msg === "check") {
    lineReply(
      reply_token,
      `Temperature ${tempTmp}°c\nHumidity : ${humidTmp}%\n\n${
        rainTmp === "0" ? "It is clear in PSU." : "It is raining in PSU."
      }`
    );
  } else
    lineReply(reply_token, 'Type "check" to check the weather in PSU now !');
  res.sendStatus(200);
});

app.post("/api/iotdata", (req, res) => {
  console.log(req.body);
  const { temp, humid, light, rain } = req.body;
  io.sockets.emit("temp", temp);
  io.sockets.emit("humid", humid);
  io.sockets.emit("light", light);
  io.sockets.emit("rain", rain);
  tempTmp = temp;
  humidTmp = humid;
  if (rainTmp !== rain) {
    rainTmp = rain;
    if (rain === "1") {
      lineBroadcast("It is rainning in PSU now !");
    } else lineBroadcast("Rain in PSU has stopped just now !");
  }
  res.send("OK");
});

server.listen(PORT, () => {
  lineBroadcast("Server has started !");
  console.log("Server has started !");
});

io.on("connection", (socket) => {
  socket.emit("temp", 0);
  socket.emit("humid", 0);
  socket.emit("light", 0);
  socket.emit("rain", 0);
});
//replace "x" with real generated token from line dev console.
const lineToken = "x";

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
