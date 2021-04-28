const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require("cors");
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const request = require("request");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SERVER IS UP");
});

app.post("/webhook", (req, res) => {
  let reply_token = req.body.events[0].replyToken;
  reply(reply_token);
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

function reply(reply_token) {
  let headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer {${lineToken}}`,
  };
  let body = JSON.stringify({
    replyToken: reply_token,
    messages: [
      {
        type: "text",
        text: "Hello",
      },
      {
        type: "text",
        text: "How are you ?",
      },
    ],
  });
  request.post(
    {
      url: "https://api.line.me/v2/bot/message/reply",
      headers: headers,
      body: body,
    },
    (err, res, body) => {
      console.log("status = " + res.statusCode);
    }
  );
}
