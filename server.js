const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  console.log("a");
  res.send("b");
});

app.post("/api/temp", (req, res) => {
  console.log(req.query.temp);
  res.send("Temp : " + req.query.temp);
});

app.listen(PORT, () => console.log("Server has started !"));
