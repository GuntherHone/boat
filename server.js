const express = require("express");

const app = express();

app.use(express.static("static"));

app.listen(5555, () => {
  console.log("listening on port 5555");
});
