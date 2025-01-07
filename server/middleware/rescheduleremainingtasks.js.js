/*const pool = require("../Utils/db");
const tableName = require("../Utils/allTableNames");
const moment = require("moment-timezone");

const rescheduling = async () => {
  try {
    const todayDate = moment().tz("Asia/Karachi").format("YYYY-MM-DD");
    console.log("today==>", todayDate);

    const query = `
      SELECT * 
      FROM ${tableName.tasks} 
      WHERE Response = 2
        AND SERVICE_DATE = ?
        AND isactive = 0;
    `;

    pool.query(query, [todayDate], (err, results) => {
      if (err) {
        console.error("Error fetching data from tasks table:", err);
        return;
      }

      if (results.length > 0) {
        console.log(`Found ${results.length} tasks to be rescheduled.`);

        results.forEach((item) => {
          const rescheduledate = moment(item.service_date).add(7, "days").format("YYYY-MM-DD");
          console.log(`Task ${item.id} rescheduled to ${rescheduledate}`);

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
              console.error(`Error updating client ${item.client_id}:`, updateErr);
            } else {
              console.log(`Client ${item.client_id} successfully rescheduled.`);
            }
          });

          pool.query(updateTaskQuery, [item.id], (taskUpdateErr) => {
            if (taskUpdateErr) {
              console.error(`Error updating task ${item.id} to inactive:`, taskUpdateErr);
            } else {
              console.log(`Task ${item.id} marked as inactive.`);
            }
          });
        });
      } else {
        console.log("No tasks to be rescheduled.");
      }
    });
  } catch (error) {
    console.error("Error in rescheduling function:", error.message);
  }
};

module.exports = { rescheduling };*/

const { performQuery } = require("../Utils/performQuery");
const tableName = require("../Utils/allTableNames");
const moment = require("moment-timezone");

const rescheduling = async (pool) => {
  try {
    const todayDate = moment().tz("Asia/Karachi").format("YYYY-MM-DD");
    console.log("today==>", todayDate);

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
      console.log(`Found ${results.length} tasks to be rescheduled.`);

      for (const item of results) {
        const rescheduledate = moment(item.service_date)
          .add(7, "days")
          .format("YYYY-MM-DD");
        console.log(`Task ${item.id} rescheduled to ${rescheduledate}`);

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
        console.log(`Client ${item.client_id} successfully rescheduled.`);

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
        console.log(`Task ${item.id} marked as inactive.`);
      }
    } else {
      console.log("No tasks to be rescheduled.");
    }
  } catch (error) {
    console.error("Error in rescheduling function:", error.message);
  }
};

module.exports = { rescheduling };

