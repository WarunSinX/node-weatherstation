const app = require("express")();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  console.log("a");
  res.send("b");
});

app.listen(PORT, () => console.log("Server has started !"));
