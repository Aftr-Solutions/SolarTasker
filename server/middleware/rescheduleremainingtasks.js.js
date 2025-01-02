const pool = require("../Utils/db");
const tableName = require("../Utils/allTableNames");
const moment = require("moment-timezone");

const rescheduling = async () => {
  try {
    const todayDate = moment().tz("Asia/Karachi").format("YYYY-MM-DD");
    console.log("today==>",todayDate);
    const query = `
      SELECT * 
      FROM ${tableName.tasks} 
      WHERE Response = 2
        AND SERVICE_DATE = ?
        AND isactive = 0;
    `;

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting database connection:", err);
        return;
      }

      connection.query(query, [todayDate], (err, results) => {
        if (err) {
          console.error("Error fetching data from tasks table:", err);
          connection.release(); // Ensure connection is released
          return;
        }

        if (results.length > 0) {
          console.log(`Found ${results.length} tasks to be rescheduled.`);

          results.forEach((item) => {
            const rescheduledate = moment(item.service_date).add(7, "days").format("YYYY-MM-DD");
            console.log(`Task ${item.id} rescheduled to ${rescheduledate}`);
            // Update the task's service date in the database if required
            const updateQuery = `
              UPDATE ${tableName.clients} 
              SET UPCOMING_SERVICE_DATE  = ? 
              WHERE id = ?;
            `;

            const updateTaskQuery = `
              UPDATE ${tableName.tasks}
              SET isactive = 1
              WHERE id = ${task_id};
            `;

            connection.query(updateQuery, [rescheduledate, item.client_id], (updateErr) => {
              if (updateErr) {
                console.error(`Error updating task ${item.id}:`, updateErr);
              } else {
                console.log(`Task ${item.id} successfully rescheduled.`);
              }
            });

            // Update the task to set isactive to 0
            connection.query(updateTaskQuery, (taskUpdateErr) => {
              if (taskUpdateErr) {
                console.error(`Error updating task ${task_id} to inactive:`, taskUpdateErr);
                return;
              }
              console.log(`Task ${task_id} marked as inactive.`);
            });
          });
        } else {
          console.log("No tasks to be rescheduled.");
        }

        connection.release(); // Release the connection after processing
      });
    });
  } catch (error) {
    console.error("Error in rescheduling function:", error.message);
  }
};

module.exports = { rescheduling };
