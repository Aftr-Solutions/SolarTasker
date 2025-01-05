const { performQuery } = require("../Utils/performQuery");
const tableName = require("../Utils/allTableNames");
const logger = require("../logger");
const axios = require("axios");
const moment = require("moment-timezone");

const ACCESS_TOKEN = "EAAItPCtNug4BO8Axc7ot6Anjkeki2EJ8I1xCqOF8wEJF06tgWwZCX4mZA4xi5YBdHKdZAZBcQMOHLVBiq7RiSAe26KSq3e55zdM1dmk6UmPXRPvUCPKgm3Tsf8hEZB3VKhlZAyL6oSEkTJnZBCZBf0CWOxkqquoVwAgfva0OIUTxLA7SmbB4qlHIkqShv81Ynx9ctAZDZD";
const PHONE_NUMBER_ID = "519207967946235"; // Replace with your WhatsApp Phone Number ID
const API_URL = `https://graph.facebook.com/v16.0/${PHONE_NUMBER_ID}/messages`;

const sendMessagetoteams = async (pool) => {
  try {
    const todayDate = moment().tz("Asia/Karachi").format("YYYY-MM-DD");
    logger.info("today==>", todayDate);

    // Query to get clients with upcoming services
    const selectQuery = `
      SELECT 
          t.team_id,
          t.client_id,
          c.name AS client_name,
          c.address,
          c.number AS client_contact,
          IF(c.plan = 0, 'Basic', 'Premium') AS plan_type,
          COUNT(t.client_id) AS client_count
      FROM 
          ${tableName.tasks} t
      INNER JOIN 
          ${tableName.clients} c 
      ON 
          c.id = t.client_id
      WHERE 
          t.service_date = ? AND
          t.response = 1 
      GROUP BY 
          t.team_id, c.number;
    `;

    const clientResults = await performQuery({
      sql: selectQuery,
      params: [todayDate],
      pool: pool,
    });

    if (clientResults.length > 0) {
      logger.info(`Found ${clientResults.length} clients that have services today. Extracting unique team IDs...`);

      // Extract unique team IDs
      const uniqueTeamIds = [...new Set(clientResults.map((item) => item.team_id))];

      logger.info(`Unique Team IDs: ${uniqueTeamIds}`);

      // Query to get team members for the extracted team IDs
      const teamMemberQuery = `
        SELECT 
            t.id AS team_id, 
            t.name As team_name
            w.name AS team_lead, 
            w.number AS team_contact
        FROM 
            ${tableName.teams} t 
        INNER JOIN 
            ${tableName.workers} w 
        ON 
            t.member1_id = w.id
        WHERE 
            t.id IN (${uniqueTeamIds.map(() => "?").join(",")});
      `;

      const teamMembers = await performQuery({
        sql: teamMemberQuery,
        params: uniqueTeamIds,
        pool: pool,
      });

      if (teamMembers.length > 0) {
        logger.info(`Found ${teamMembers.length} team Leads to send messages.`);

        // Combine clients and team members based on `team_id`
        const combinedResults = uniqueTeamIds.map((teamId) => {
          const teamInfo = teamMembers.find((member) => member.team_id === teamId);
          const clients = clientResults.filter((client) => client.team_id === teamId);
          return { teamInfo, clients };
        });

        // Process combined results
        for (const { teamInfo, clients } of combinedResults) {
          logger.info(`Sending message to Team ${teamInfo.team_name}, led by ${teamInfo.team_lead}`);
          for (const client of clients) {
            const message = `Hello ${teamInfo.team_lead}, you have a service scheduled for ${client.client_name} (${client.plan_type}) at ${client.address}.`;
            logger.info(`Sending message: "${message}" to ${teamInfo.team_contact}`);
            
            // Sending message using WhatsApp API
            await axios.post(API_URL, {
              messaging_product: "whatsapp",
              to: teamInfo.team_contact,
              type: "text",
              text: { body: message },
            }, {
              headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                "Content-Type": "application/json",
              },
            });

            logger.info(`Message sent to ${teamInfo.team_lead}`);
          }
        }
      } else {
        logger.info("No team members found for the extracted team IDs.");
      }
    } else {
      logger.info("No clients with today services.");
    }
  } catch (error) {
    logger.error("Error in WhatsApp message send cron job:", error.message);
  }
};

module.exports = { sendMessagetoteams };
