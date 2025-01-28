const WebSocket = require("ws");
const { performQuery } = require("../Utils/performQuery");
const tableName = require("../Utils/allTableNames");
const moment = require("moment-timezone");
const cronpool = require("../Utils/crondb");
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", async (ws) => {
  console.log("New WebSocket connection established.");

  try {
    const fetchNotificationsQuery = `SELECT message, created_at FROM ${tableName.notification} ORDER BY created_at DESC;`;
    const notifications = await performQuery({
      sql: fetchNotificationsQuery,
      params: [],
      pool: cronpool,
    });

    ws.send(
      JSON.stringify({
        type: "history",
        notifications,
      })
    );
  } catch (error) {
    logger.error(`Error fetching notifications: ${error.message}`);
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Failed to fetch notifications.",
      })
    );
  }

  ws.on("close", () => {
    console.log("WebSocket connection closed.");
  });

  ws.on("error", (err) => {
    logger.error(`WebSocket error: ${err.message}`);
  });
});

const broadcastNotification = async (message) => {
  try {
    const timestamp = moment.tz("Asia/Karachi").format("YYYY-MM-DD HH:mm:ss");
    const insertQuery = `INSERT INTO ${tableName.notification} (message, created_at) VALUES (?,?);`;
    await performQuery({
      sql: insertQuery,
      params: [message, timestamp],
      pool: cronpool,
    });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(
            JSON.stringify({
              type: "new",
              notification: { message, created_at: timestamp },
            })
          );
        } catch (err) {
          logger.error(`Error sending notification: ${err.message}`);
        }
      }
    });
  } catch (error) {
    logger.error(`Error broadcasting notification: ${error.message}`);
  }
};

module.exports = { broadcastNotification };
