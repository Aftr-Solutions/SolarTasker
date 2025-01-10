/*const pool = require("../Utils/db");
const tableName = require("../Utils/allTableNames");
const moment = require("moment-timezone");

const rescheduling = async () => {
  try {
    const todayDate = moment().tz("Asia/Karachi").format("YYYY-MM-DD");
    logger.info("today==>", todayDate);

    const query = `
      SELECT * 
      FROM ${tableName.tasks} 
      WHERE Response = 2
        AND SERVICE_DATE = ?
        AND isactive = 0;
    `;

    pool.query(query, [todayDate], (err, results) => {
      if (err) {
        logger.error("Error fetching data from tasks table:", err);
        return;
      }

      if (results.length > 0) {
        logger.info(`Found ${results.length} tasks to be rescheduled.`);

        results.forEach((item) => {
          const rescheduledate = moment(item.service_date).add(7, "days").format("YYYY-MM-DD");
          logger.info(`Task ${item.id} rescheduled to ${rescheduledate}`);

          const updateQuery = `
            UPDATE ${tableName.clients} 
            SET UPCOMING_SERVICE_DATE = ? 
            WHERE id = ?;
          `;

          const updateTaskQuery = `
            UPDATE ${tableName.tasks}
            SET isactive = 1
            WHERE id = ?;
          `;

          pool.query(updateQuery, [rescheduledate, item.client_id], (updateErr) => {
            if (updateErr) {
              logger.error(`Error updating client ${item.client_id}:`, updateErr);
            } else {
              logger.info(`Client ${item.client_id} successfully rescheduled.`);
            }
          });

          pool.query(updateTaskQuery, [item.id], (taskUpdateErr) => {
            if (taskUpdateErr) {
              logger.error(`Error updating task ${item.id} to inactive:`, taskUpdateErr);
            } else {
              logger.info(`Task ${item.id} marked as inactive.`);
            }
          });
        });
      } else {
        logger.info("No tasks to be rescheduled.");
      }
    });
  } catch (error) {
    logger.error("Error in rescheduling function:", error.message);
  }
};

module.exports = { rescheduling };*/

const { performQuery } = require("../Utils/performQuery");
const tableName = require("../Utils/allTableNames");
const moment = require("moment-timezone");
const logger = require("../logger");

const rescheduling = async (pool) => {
  try {
    const todayDate = moment().tz("Asia/Karachi").format("YYYY-MM-DD");
    logger.info("today==>", todayDate);

    const selectQuery = `
      SELECT * 
      FROM ${tableName.tasks} 
      WHERE Response = 2
        AND SERVICE_DATE = ?
        AND isactive = 0;
    `;

    // Fetch tasks to be rescheduled
    const results = await performQuery({
      sql: selectQuery,
      params: [todayDate],
      pool
    });

    if (results.length > 0) {
      logger.info(`Found ${results.length} tasks to be rescheduled.`);

      for (const item of results) {
        const rescheduledate = moment(item.service_date)
          .add(7, "days")
          .format("YYYY-MM-DD");
          logger.info(`Task ${item.id} rescheduled to ${rescheduledate}`);

        // Update client's upcoming service date
        const updateClientQuery = `
          UPDATE ${tableName.clients} 
          SET UPCOMING_SERVICE_DATE = ? 
          WHERE id = ?;
        `;
        await performQuery({
          sql: updateClientQuery,
          params: [rescheduledate, item.client_id],
          pool,
        });
        logger.info(`Client ${item.client_id} successfully rescheduled.`);

        // Mark task as inactive
        const updateTaskQuery = `
          UPDATE ${tableName.tasks}
          SET isactive = 1
          WHERE id = ?;
        `;
        await performQuery({
          sql: updateTaskQuery,
          params: [item.id],
          pool,
        });
        logger.info(`Task ${item.id} marked as inactive.`);
      }
    } else {
      logger.info("No tasks to be rescheduled.");
    }
  } catch (error) {
    logger.error("Error in rescheduling function:", error.message);
  }
};

module.exports = { rescheduling };

