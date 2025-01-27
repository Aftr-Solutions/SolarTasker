const WebSocket = require("ws");

// Create WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("New WebSocket connection established.");

  ws.on("close", () => {
    console.log("WebSocket connection closed.");
  });
});

// Function to broadcast logs to all connected clients
const broadcastLog = (log) => {
  console.log(`webhook log in websocket,${log}`);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(log)); 
    }
  });
};

module.exports = { broadcastLog };
