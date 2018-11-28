const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();

app.use(express.static("static"));

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

let heading = 0;

setInterval(() => {
  heading = (heading + 1) % 360;
  let serializedHeading = JSON.stringify({ heading });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(serializedHeading);
    }
  });
}, 30);

wss.on("connection", (ws, req) => {
  ws.on("close", (socket, code, reason) =>
    console.log(`Connection to ${req.connection.remoteAddress} closed.`)
  );
  console.log(`${req.connection.remoteAddress}`);
});

server.listen(5555, () => {
  console.log("listening on port 5555");
});
