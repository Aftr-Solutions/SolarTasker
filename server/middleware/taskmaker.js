/*const pool = require("../Utils/db");
const tableName = require("../Utils/allTableNames");
const moment = require("moment-timezone");

const mytask = async () => {
  try {
    const todayDate = moment().tz("Asia/Karachi").format("YYYY-MM-DD");
    logger.info("today==>", todayDate);

    const query = `
      SELECT id, upcoming_service_date, plan 
      FROM ${tableName.clients} 
      WHERE DATEDIFF(upcoming_service_date, ?) = 2
    `;

    const connection = await pool.getConnection();

    try {
      const [results] = await connection.query(query, [todayDate]);

      if (results.length > 0) {
        logger.info(`Found ${results.length} clients with upcoming services.`);

        const tasks = results.map((item) => ([
          item.id,
          item.upcoming_service_date,
          item.plan,
        ]));

        const insertQuery = `
          INSERT INTO ${tableName.tasks} (client_id, service_date, plan) VALUES ?
        `;
        const [insertResults] = await connection.query(insertQuery, [tasks]);

        logger.info(
          `Successfully created ${insertResults.affectedRows} tasks.`
        );
      } else {
        logger.info("No clients with upcoming services within 2 days.");
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    logger.error("Error in mytask cron job:", error.message);
  }
};

module.exports = { mytask };*/

const { performQuery } = require("../Utils/performQuery"); // Import the performQuery utility
const tableName = require("../Utils/allTableNames");
const moment = require("moment-timezone");
const logger = require("../logger");


const mytask = async (pool) => {
  try {
    const todayDate = moment().tz("Asia/Karachi").format("YYYY-MM-DD");
    logger.info("today==>", todayDate);

    // Query to select clients with upcoming services
    const selectQuery = `
      SELECT id, upcoming_service_date, plan 
      FROM ${tableName.clients} 
      WHERE DATEDIFF(upcoming_service_date, ?) = 2
    `;

    const results = await performQuery({
      sql: selectQuery,
      params: [todayDate],
      pool:pool,
    });

    if (results.length > 0) {
      logger.info(`Found ${results.length} clients with upcoming services.`);

      // Prepare tasks data for insertion
      const tasks = results.map((item) => [
        item.id,
        item.upcoming_service_date,
        item.plan,
      ]);

      // Query to insert new tasks
      const insertQuery = `
        INSERT INTO ${tableName.tasks} (client_id, service_date, plan) VALUES ?
      `;

      const insertResults = await performQuery({
        sql: insertQuery,
        params: [tasks],
        pool:pool,
      });

      logger.info(`Successfully created ${insertResults.affectedRows} tasks.`);
    } else {
      logger.info("No clients with upcoming services within 2 days.");
    }
  } catch (error) {
    logger.error("Error in mytask cron job:", error.message);
  }
};

module.exports = { mytask };


