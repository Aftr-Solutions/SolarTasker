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

async function sendmessageOfcoming(clientnumber, name) {
  if (!clientnumber || !name) {
    logger.error("Invalid parameters: clientnumber or name is missing.");
    return;
  }

  const payload = {
    messaging_product: "whatsapp",
    to: clientnumber, // Recipient's phone number
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
      `Message sent to ${clientnumber}. Response status: ${response.status}`
    );
  } catch (error) {
    logger.error(
      `Error sending message to ${clientnumber}: ${error.response?.data || error.message}`
    );
  }
}

async function sendmessageoffeedback(clientnumber, name) {
  if (!clientnumber || !name) {
    logger.error("Invalid parameters: clientnumber or name is missing.");
    return;
  }
  const payload = {
    messaging_product: "whatsapp",
to: clientnumber, // Recipient's phone number
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
          id:" Rating 1",
          title: "1 - Very Poor",
        },
      },
      {
        type: "reply",
        reply: {
          id:" Rating 2",
          title: "2 - Poor",
        },
      },
      {
        type: "reply",
        reply: {
          id:" Rating 3",
          title: "3 - Average",
        },
      },
      {
        type: "reply",
        reply: {
          id:" Rating 4",
          title: "4 - Good",
        },
      },
      {
        type: "reply",
        reply: {
          id:" Rating 5",
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
      `Message sent to ${clientnumber}. Response status: ${response.status}`
    );
  } catch (error) {
    logger.error(
      `Error sending message to ${clientnumber}: ${error.response?.data || error.message}`
    );
  }
}

// Webhook to handle WhatsApp messages and button responses
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    logger.info("Webhook received data:", JSON.stringify(data, null, 2));

    if (data.object !== "whatsapp_business_account") {
      logger.info("Not a WhatsApp business account webhook.");
      return res.status(200).send("EVENT_RECEIVED");
    }

    const messages = data.entry?.[0]?.changes?.[0]?.value?.messages;
    logger.info("Messages received:", messages);

    if (messages && messages.length > 0) {
      for (const message of messages) {
        if (message.interactive?.type === "button_reply") {
          const buttonReply = message.interactive.button_reply;
          const buttonTitle = buttonReply.title;
          const from = message.from;

          logger.info(`Team responded with ID: ${from} and Button Title: ${buttonTitle}`);

          let teamRes = null;
          let clientRes=null;
          let clientNumber = buttonReply.id.replace(buttonTitle, "").trim();

          if (buttonTitle === "On the way") {
            teamRes = 1;
            logger.info(`Team ${from} is on the way to the service for ${clientNumber}.`);
          } else if (buttonTitle === "Start working") {
            teamRes = 2;
            logger.info(`Team ${from} has started working on the service for ${clientNumber}.`);
          } else if (buttonTitle === "Completed") {
            teamRes = 3;
            logger.info(`Team ${from} has completed the service for ${clientNumber}.`);
          } else if (buttonTitle === "1 - Very Poor") {
            logger.info(`Client`)
          }


          if (teamRes !== null) {
            try {
              // Query to find team by phone number
              const getQuery = `
                SELECT t.id AS id, t.team_name AS name 
                FROM ${tableName.team} t 
                INNER JOIN ${tableName.workers} w ON t.memmber1 = w.id 
                WHERE w.number = ?;
              `;
              const results = await performQuery({
                sql: getQuery,
                params: [from],
                pool: cronpool,
              });

              if (results.length > 0) {
                const team = results[0];
                logger.info(`Found team ${team.name} with ID: ${team.id}`);

                // Update task response
                const updateQuery = `
                  UPDATE ${tableName.tasks} t 
                  INNER JOIN ${tableName.clients} c ON t.client_id = c.id
                  SET t.task_status = ?
                  WHERE t.isactive = 0 AND t.team_id = ? AND c.number = ?;
                `;
                const updateRes = await performQuery({
                  sql: updateQuery,
                  params: [teamRes, team.id, clientNumber],
                  pool: cronpool,
                });

                logger.info(`Updated task response for client ${clientNumber} with task status ${teamRes}`);
              } else {
                logger.warn(`No team found with phone number: ${from}`);
              }
              if (teamRes===1){
                await sendmessageOfcoming(clientNumber,results[0].name)
              }
              if (teamRes===3){
                await sendmessageoffeedback(clientNumber,results[0].name)
              }
            } catch (queryError) {
              logger.error(`Database query error: ${queryError.message}`);
            }
          }
          if(clientRes !== null){
            try{

            }catch(queryError){
              logger.error(`Database query error: ${queryError.message}`);
            }
          }

        }
      }
    } else {
      logger.info("No messages found in the webhook data.");
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
