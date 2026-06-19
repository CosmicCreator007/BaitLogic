const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/prediction", (req, res) => {
  res.sendFile(path.join(__dirname, "prediction.html"));
});

app.listen(3000, () => {
  console.log("BaitLogic running on http://localhost:3000");
});