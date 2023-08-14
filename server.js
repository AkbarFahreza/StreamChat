const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(bodyParser.json());
app.use(express.static(__dirname));
let data = [];

wss.on("connection", (ws) => {
  console.log("New WebSocket connection");
  ws.send(JSON.stringify(data));

  ws.on("message", (message) => {
    const entry = JSON.parse(message);
    data = [entry];

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });
});

app.post("/data", (req, res) => {
  const newEntry = req.body;

  data = [newEntry];

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });

  res.status(201).send("Data saved.");
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
