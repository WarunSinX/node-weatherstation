const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SERVER IS UP");
});

app.post("/api/temp", (req, res) => {
  console.log(req.body);
  res.send("OK");
});

app.post("/api/humid", (req, res) => {
  console.log(req.body);
  res.send("OK");
});

app.post("/api/light", (req, res) => {
  console.log(req.body);
  res.send("OK");
});

app.post("/api/rain", (req, res) => {
  console.log(req.body);
  res.send("OK");
});

app.listen(PORT, () => console.log("Server has started !"));
