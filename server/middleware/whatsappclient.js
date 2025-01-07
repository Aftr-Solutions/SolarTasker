const { performQuery } = require("../Utils/performQuery");
const tableName = require("../Utils/allTableNames");
const logger = require("../logger");
const axios = require("axios");
const moment = require("moment-timezone");

const ACCESS_TOKEN = "EAAItPCtNug4BO2KWhIFcf3zxZA0YTDsTAZCpVil4lv53yKtTqnA5fgmQJUVobqd8NvYDZAPAyR7OvdKWfzoCjrd7SuOwvkKN95Td1lg2ZCZB9WZCLBTznYK7YX1LavYqKhG7pOP2uV8PL4RyEVR6yyh1DdSlIU4x4eePZAkcFLuxuRubOkeBTTai6DSvqmPlhq42PtZAZCQopSyvJrOQoHYrLuaGltYJfJspBkKJ8ZBNIGGODGkZANoZCaEZD";
//const PHONE_NUMBER_ID = "519207967946235"; // Replace with your WhatsApp Phone Number ID
const API_URL = `https://graph.facebook.com/v21.0/519207967946235/messages`;

const sendMessage = async (pool) => {
  try {
    const todayDate = moment().tz("Asia/Karachi").format("YYYY-MM-DD");
    logger.info(`today==>, ${todayDate}`);

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
    logger.info("Query Results:", results);
    // Iterate over results and send WhatsApp messages
    for (const item of results) {
      const payload = {
        "messaging_product": "whatsapp",
        "to": item.number, // Use `item` here
        "type": "template",
        "template": {
          "name": "service_message",
          "language": { "code": "en" },
          "components": [
            {
              "type": "body",
              "parameters": [
                { "type": "text", "text": item.name }, // Use `item` here
                { "type": "text", "text": moment(item.service_date).format("YYYY-MM-DD") }, // Format date
                { "type": "text", "text": item.address } // Use `item` here
              ]
            }
          ]
        }
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
        logger.error(`Error sending message to ${item.name} (${item.number}):`, error.response?.data || error.message);
      }      
    }
  } catch (error) {
    logger.error(`Error in WhatsApp message send cron job: ${error.message}`);
  }
};


module.exports = {sendMessage };
