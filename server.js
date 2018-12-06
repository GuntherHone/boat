const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const ProtocolParser = require("./protocol-parser.js");
const SerialPort = require("serialport");

const SERIAL_PORT = "/dev/ttyAMA0";

const app = express();

app.use(express.static("static"));

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

let heading = 0;

wss.on("connection", (ws, req) => {
  ws.on("close", (socket, code, reason) =>
    console.log(`Connection to ${req.connection.remoteAddress} closed.`)
  );
  console.log(`Connection from ${req.connection.remoteAddress}`);
});

server.listen(5555, () => {
  console.log("listening on port 5555");
});

const port = new SerialPort(SERIAL_PORT, err =>
  err ? console.log(err) : console.log("opened serial port...")
);

port.pipe(new ProtocolParser()).on("data", data => {
  let serializedHeading = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(serializedHeading);
    }
  });
});

process.on("SIGINT", () => {
  console.log("Performing clean-up...");
  port.close();
  server.close();
  process.exit();
});

process.on("exit", () => {
  console.log("done")
})
