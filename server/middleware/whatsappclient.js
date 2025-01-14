const { performQuery } = require("../Utils/performQuery");
const tableName = require("../Utils/allTableNames");
const logger = require("../logger");
const axios = require("axios");
const moment = require("moment-timezone");


const ACCESS_TOKEN = "EAAItPCtNug4BO9MSmyItkRMO6LtPjFRcQnpeoGA6tYqq4aokmLym7GIiXAzyh4uxDH7vjyEzKuvZBu5LIRwnqB9LNJ7ijVQ6ofbRddZAfwYf4cUsY3MZBlUwj7eJv3AltupzBgMOcgjUVILsaxqTgqSxwBVWlY4cIMpFnlFguvsRUgCfae6XpwrvZAVDyt4RxZA1TxcruhFDhQpimPRywbJiBRgn6VjirUmHpoAdL79rm1rpaJZBMZD";
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
      WHERE DATEDIFF(t.service_date, ?) = 2 AND t.response<> 1 ;
    `;

    const results = await performQuery({
      sql: selectQuery,
      params: [todayDate],
      pool: pool,
    });

    if (results.length > 0) {
      logger.info(`Found ${results.length} clients with upcoming services.`);
    } else {
      logger.info("No clients with upcoming services.");
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
