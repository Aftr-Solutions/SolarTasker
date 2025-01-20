const express = require("express");
const router = express.Router();
const tableName = require("../Utils/allTableNames");
const cronpool = require("../Utils/crondb");
const logger = require("../logger");
const { performQuery } = require("../Utils/performQuery");

// Webhook to handle WhatsApp messages and button responses
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    logger.info("Webhook received data:", JSON.stringify(data, null, 2));

    if (data.object === "whatsapp_business_account") {
      const messages = data.entry?.[0]?.changes?.[0]?.value?.messages;
      logger.info("Messages received:", messages);

      if (messages && messages.length > 0) {
        for (const message of messages) {
          if (message.type === "button") {
            const buttonResponse = message.button?.text; // 'Yes' or 'No'
            const from = message.from; // Client's phone number
            let client_res = null;

            if (buttonResponse === "Yes") {
              logger.info(`Client ${from} agreed to the service.`);
              client_res = 1;
            } else if (buttonResponse === "No") {
              logger.info(`Client ${from} declined the service.`);
              client_res = 2;
            }

            try {
              // Query to find client by phone number
              const getQuery = `SELECT id, name FROM ${tableName.clients} WHERE number = ?;`;
              const results = await performQuery({
                sql: getQuery,
                params: [from],
                pool: cronpool,
              });

              if (results.length > 0) {
                const client = results[0];
                logger.info(`Found client: ${client.name} with ID: ${client.id}`);

                // Update task response
                const updateQuery = `
                  UPDATE ${tableName.tasks}
                  SET response = ?,whats_clinet_res = 1
                  WHERE isactive = 1 AND client_id = ? AND whats_client_res = 0;
                `;
                const updateRes = await performQuery({
                  sql: updateQuery,
                  params: [client_res, client.id],
                  pool: cronpool,
                });

                logger.info(`Updated task response for client ${client.name} with ID: ${client.id}`);
              } else {
                logger.warn(`No client found with phone number: ${from}`);
              }
            } catch (queryError) {
              logger.error(`Database query error: ${queryError.message}`);
            }
          }
        }
      } else {
        logger.info("No messages found in the webhook data.");
      }
    }

    res.status(200).send("EVENT_RECEIVED");
  } catch (error) {
    logger.error("Error processing webhook data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Verification endpoint for webhook
router.get("/", (req, res) => {
  const VERIFY_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJBZG1pbk9mU29sYXIiLCJlbWFpbCI6ImFiZHVscmFmYXlhdHBha0BnbWFpbC5jb20iLCJpYXQiOjE3MzY4ODg0NDQsImV4cCI6MTczNzI0ODQ0NH0.H5nAGzVu3Kc--og_MDZJYlYfH0id7a3df7oO8yNt4zU"; // Replace with your verification token

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  logger.info(`Webhook verification received: mode=${mode}, token=${token}, challenge=${challenge}`);

  if (mode && token === VERIFY_TOKEN) {
    logger.info("Webhook verified successfully");
    res.status(200).send(challenge);
  } else {
    logger.error("Webhook verification failed");
    res.status(403).send("Forbidden");
  }
});

module.exports = router;
