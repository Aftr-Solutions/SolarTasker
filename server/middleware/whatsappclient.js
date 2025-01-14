const { performQuery } = require("../Utils/performQuery");
const tableName = require("../Utils/allTableNames");
const logger = require("../logger");
const axios = require("axios");
const moment = require("moment-timezone");

const ACCESS_TOKEN = "EAAItPCtNug4BO5SV1NyZBuciZCd1IgwkO7EDUdTa2bSOXHZCktMESfRrjkt9a83O7DSl5AZAqG8agogEArN5SHPLznZACvXN1bW5mz39xiMCcbpC4txvGIMupYiZA8Dg4tnZAhZArIX8x8rDECgWgS1sIQmniqm2jTf80NMYusRZARnSdHf9V7xhaiRVKL48aY9ZCeBsisThU1XpSpm4vjNpGgtZAz94Lc39fMkMQUSP7v4";
const PHONE_NUMBER_ID = "519207967946235"; // Replace with your WhatsApp Phone Number ID
const API_URL = `https://graph.facebook.com/v16.0/${PHONE_NUMBER_ID}/messages`;

const sendMessage = async (pool) => {
  try {
    const todayDate = moment().tz("Asia/Karachi").format("YYYY-MM-DD");
    logger.info("Today:", todayDate);

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
                { type: "text", text: moment(item.service_date).format("YYYY-MM-DD") },
                { type: "text", text: item.address} // Service date
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
