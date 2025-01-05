const { performQuery } = require("../Utils/performQuery");
const tableName = require("../Utils/allTableNames");
const logger = require("../logger");
const axios = require("axios");
const moment = require("moment-timezone");

const ACCESS_TOKEN = "EAAItPCtNug4BOZCnaGQebseiVIL1ZBsnlRLYzgUlGLlQy2G8yYbK0fJ3oafmXueOnwp0B1zantpl6r106dcUry5tMpQIGkwxZBorLGMEqb6YAaxuoglVdZBsqyLk57VKeuz2R6xIMdI6hsE8BXKSBhA8wajbZC6B0cwAUdrE3v5hck2HZCusO3UrZAQLYaq0ZAkZBmrany577ek9ViVdpx1smobObTXJbELkAeKZAph7CQf5jeUDRqyr4ZD";
const PHONE_NUMBER_ID = "519207967946235"; // Replace with your WhatsApp Phone Number ID
const API_URL = `https://graph.facebook.com/v16.0/${PHONE_NUMBER_ID}/messages`;

const sendMessage = async (pool) => {
  try {
    const todayDate = moment().tz("Asia/Karachi").format("YYYY-MM-DD");
    logger.info("today==>", todayDate);

    // Query to get clients with upcoming services in 2 days
    const selectQuery = `
      SELECT c.name, c.number, c.address, t.service_date
      FROM ${tableName.clients} c
      INNER JOIN ${tableName.tasks} t ON c.id = t.client_id
      WHERE DATEDIFF(t.service_date, ?) = 2 ;
    `;

    const results = await performQuery({
      sql: selectQuery,
      params: [todayDate],
      pool: pool,
    });

    if (results.length > 0) {
      logger.info(`Found ${results.length} clients with services in coming 2 days so sending messages to clients.`);
    } else {
      logger.info("No clients with upcoming services n 2 days.");
      return;
    }

    // Iterate over results and send WhatsApp messages
    for (const item of results) {
      const payload = {
        messaging_product: "whatsapp",
        to: item.number, // Client's phone number
        type: "template",
        template: {
          name: "service_call",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: item.name }, // Client name
                { type: "text", text: moment(item.service_date).format("YYYY-MM-DD") },// Service date
                { type: "text", text: item.address} 
              ],
            },
          ],
        },
      };

      try {
        const response = await axios.post(API_URL, payload, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        });
        logger.info(`Message sent to ${item.name} (${item.number}) successfully.`);
      } catch (error) {
        logger.error(`Error sending message to ${item.name} (${item.number}):`,  error.message || error.response?.data );
      }
    }
  } catch (error) {
    logger.error("Error in WhatsApp message send cron job:", error.message);
  }
};


module.exports = {sendMessage };
