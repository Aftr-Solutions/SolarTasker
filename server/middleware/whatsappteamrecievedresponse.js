const express = require("express");
const router = express.Router();
const tableName = require("../Utils/allTableNames");
const cronpool = require("../Utils/crondb");
const logger = require("../logger");
const { performQuery } = require("../Utils/performQuery");
const axios = require("axios");

const ACCESS_TOKEN = "EAAItPCtNug4BO2a9vtZBBCsKXyQ94jNM6bBvjOVxHGhSQwLkYHSElxJRtZA1UcCvPkpq2WacH259ziUz5TqLDkwsk7esA3JAFZCYKZAwvf2vqbOGmYnYbgp27Gu4ECUlN2GIjfVBMdxcVGBOIr6tVXXJaKV5cCnomsYyP9OspgHZBIqquSM8ZB2fcvebV44KlFxsPqZBaW08C4sDhP75M58PGcD0iQnjwFGlMUWTJZByfUwZCu5H4OCMZD";
//const PHONE_NUMBER_ID = "519207967946235"; // Replace with your WhatsApp Phone Number ID
const API_URL = `https://graph.facebook.com/v21.0/519207967946235/messages`;

async function sendmessageOfcoming(clientNumberOrTeamId, name) {
  if (!clientNumberOrTeamId || !name) {
    logger.error("Invalid parameters: clientNumberOrTeamId or name is missing.");
    return;
  }

  const payload = { 
    messaging_product: "whatsapp",
    to: clientNumberOrTeamId, // Recipient's phone number
    type: "text",
    text: {
      body: `Team ${name} is on the way to you and will arrive in approximately 15 minutes to 1 hour.`,
    },
  };

  try {
    const response = await axios.post(API_URL, payload, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    logger.info(
      `Message sent to ${clientNumberOrTeamId}. Response status: ${response.status}`
    );
  } catch (error) {
    logger.error(
      `Error sending message to ${clientNumberOrTeamId}: ${error.response?.data || error.message}`
    );
  }
}

async function sendmessageoffeedback(clientNumberOrTeamId, name,team_id) {
  if (!clientNumberOrTeamId || !name) {
    logger.error("Invalid parameters: clientNumberOrTeamId or name is missing.");
    return;
  }
  const payload = {
    messaging_product: "whatsapp",
to: clientNumberOrTeamId, // Recipient's phone number
type: "interactive",
interactive: {
  type: "button",
  body: {
    text: `Dear,\n\nPlease rate the service provided by our team ${name} at your house this will help us to manintain better service for you.\n\nClick one of the buttons below to rate the service from 1 to 5:\n\n1 - Very Poor\n2 - Poor\n3 - Average\n4 - Good\n5 - Excellent\n\nSystem By Abdul Rafay`,
  },
  action: {
    buttons: [
      {
        type: "reply",
        reply: {
          id:"1 - Very Poor"+String(team_id),
          title: "1 - Very Poor",
        },
      },
      {
        type: "reply",
        reply: {
          id:"2 - Poor"+String(team_id),
          title: "2 - Poor",
        },
      },
      {
        type: "reply",
        reply: {
          id:"3 - Average"+String(team_id),
          title: "3 - Average",
        },
      },
      {
        type: "reply",
        reply: {
          id:"4 - Good"+String(team_id),
          title: "4 - Good",
        },
      },
      {
        type: "reply",
        reply: {
          id:"5 - Excellent"+String(team_id),
          title: "5 - Excellent",
        },
      },
    ],
  },
},
  }
  
  try {
    const response = await axios.post(API_URL, payload, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    logger.info(
      `Message sent to ${clientNumberOrTeamId}. Response status: ${response.status}`
    );
  } catch (error) {
    logger.error(
      `Error sending message to ${clientNumberOrTeamId}: ${error.response?.data || error.message}`
    );
  }
}

// Webhook to handle WhatsApp messages and button responses
async function updateTaskResponse(teamRes, clientNumberOrTeamId, teamId, from) {
  try {
    const updateQuery = `
      UPDATE ${tableName.tasks} t 
      INNER JOIN ${tableName.clients} c ON t.client_id = c.id
      SET t.task_status = ?
      WHERE t.isactive = 0 AND t.team_id = ? AND c.number = ?;
    `;

    const updateRes = await performQuery({
      sql: updateQuery,
      params: [teamRes, teamId, clientNumberOrTeamId],
      pool: cronpool,
    });

    logger.info(`Updated task response for client ${clientNumberOrTeamId} with task status ${teamRes}`);
  } catch (queryError) {
    logger.error(`Database query error in updateTaskResponse: ${queryError.message}`);
  }
}

async function recordFeedback(clientId, teamId, clientRes) {
  try {
    // Fetch task ID
    const taskQuery = `SELECT id FROM ${tableName.tasks} WHERE client_id = ? AND team_id = ?;`;
    const taskResults = await performQuery({
      sql: taskQuery,
      params: [clientId, teamId],
      pool: cronpool,
    });

    if (taskResults.length > 0) {
      const taskId = taskResults[0].id;

      // Insert feedback
      const feedbackQuery = `INSERT INTO ${tableName.feedback} (task_id, rating) VALUES (?, ?);`;
      await performQuery({
        sql: feedbackQuery,
        params: [taskId, clientRes],
        pool: cronpool,
      });

      logger.info(`Feedback recorded for Task ID: ${taskId} with rating: ${clientRes}`);
    } else {
      logger.warn(`No task found for Client ID: ${clientId} and Team ID: ${teamId}`);
    }
  } catch (queryError) {
    logger.error(`Database query error in recordFeedback: ${queryError.message}`);
  }
}

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    logger.info("Webhook received data:", JSON.stringify(data, null, 2));

    if (data.object !== "whatsapp_business_account") {
      logger.info("Not a WhatsApp business account webhook.");
      return res.status(200).send("EVENT_RECEIVED");
    }

    const messages = data.entry?.[0]?.changes?.[0]?.value?.messages;

    if (messages && messages.length > 0) {
      for (const message of messages) {
        if (message.interactive?.type === "button_reply") {
          const buttonReply = message.interactive.button_reply;
          const buttonTitle = buttonReply.title;
          const from = message.from;

          logger.info(`Button response from ${from}: ${buttonTitle}`);
          const clientNumberOrTeamId = buttonReply.id.replace(buttonTitle, "").trim();

          let teamRes = null;
          let clientRes = null;

          // Handle team actions
          if (["On the way", "Start working", "Completed"].includes(buttonTitle)) {
            teamRes = ["On the way", "Start working", "Completed"].indexOf(buttonTitle) + 1;

            // Fetch team details
            const teamQuery = `
              SELECT t.id AS team_id, t.team_name AS name 
              FROM ${tableName.team} t 
              INNER JOIN ${tableName.workers} w ON t.member1 = w.id 
              WHERE w.number = ?;
            `;
            const teamResults = await performQuery({
              sql: teamQuery,
              params: [from],
              pool: cronpool,
            });

            if (teamResults.length > 0) {
              const team = teamResults[0];
              logger.info(`Found team ${team.name} with ID: ${team.team_id}`);
              await updateTaskResponse(teamRes, clientNumberOrTeamId, team.team_id, from);

              // Send feedback or notify client
              if (teamRes === 1) {
                await sendmessageOfcoming(clientNumberOrTeamId, team.name);
              } else if (teamRes === 3) {
                await sendmessageoffeedback(clientNumberOrTeamId, team.name, team.team_id);
              }
            } else {
              logger.warn(`No team found for phone number: ${from}`);
            }
          }

          // Handle client feedback
          if (!teamRes && ["1 - Very Poor", "2 - Poor", "3 - Average", "4 - Good", "5 - Excellent"].includes(buttonTitle)) {
            clientRes = parseInt(buttonTitle.split(" ")[0], 10);

            const clientQuery = `SELECT id, name FROM ${tableName.clients} WHERE number = ?;`;
            const clientResults = await performQuery({
              sql: clientQuery,
              params: [from],
              pool: cronpool,
            });

            if (clientResults.length > 0) {
              const client = clientResults[0];
              logger.info(`Found client ${client.name} with ID: ${client.id}`);
              await recordFeedback(client.id, clientNumberOrTeamId, clientRes);
            } else {
              logger.warn(`No client found for phone number: ${from}`);
            }
          }
        }
      }
    } else {
      logger.info("No messages found in webhook data.");
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
