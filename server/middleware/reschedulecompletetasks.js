const cron = require("node-cron");
const pool = require("../Utils/db");
const tableName = require("../Utils/allTableNames");
const moment = require("moment-timezone");

const REGION_DAY_MAPPING = {
  1: 1, // Region 1 → Monday
  2: 2, // Region 2 → Tuesday
  3: 3, // Region 3 → Wednesday
  4: 4, // Region 4 → Thursday
  5: 5, // Region 5 → Friday
  6: 6, // Region 6 → Saturday
};

// Function to calculate the next scheduled day
function calculateNextScheduledDay(date, regionDay, servicePlanDuration = 0) {
  let newDate = moment.tz(date, "Asia/Karachi").add(servicePlanDuration, "days");

  const currentDay = newDate.day(); // Current day of the week
  const daysToAdd = (regionDay - currentDay + 7) % 7; // Days to next occurrence of the region day
  newDate = newDate.add(daysToAdd || 7, "days"); // Move to the next week if needed

  return newDate.format("YYYY-MM-DD HH:mm:ss");
}

const processTasks = async () => {
  try {
    const query = `
      SELECT t.id AS task_id, t.service_date, t.client_id, c.service_plan_duration, c.area_region_id
      FROM ${tableName.tasks} AS t
      JOIN ${tableName.clients} AS c ON t.client_id = c.id
      WHERE t.isactive = 1 AND t.task_status = 3 AND t.response = 2;
    `;

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting database connection:", err);
        return;
      }

      connection.query(query, (fetchErr, results) => {
        if (fetchErr) {
          console.error("Error fetching data from tasks and clients tables:", fetchErr);
          connection.release();
          return;
        }

        if (results.length > 0) {
          console.log(`Processing ${results.length} tasks for rescheduling...`);

          results.forEach((task) => {
            const { task_id, service_date, service_plan_duration, area_region_id, client_id } = task;

            const nextServiceDate = calculateNextScheduledDay(service_date, REGION_DAY_MAPPING[area_region_id], service_plan_duration);

            const updateClientQuery = `
              UPDATE ${tableName.clients}
              SET upcoming_service_date = '${nextServiceDate}'
              WHERE id = ${client_id};
            `;

            const updateTaskQuery = `
              UPDATE ${tableName.tasks}
              SET isactive = 0
              WHERE id = ${task_id};
            `;

            // Update the client's upcoming service date
            connection.query(updateClientQuery, (clientUpdateErr) => {
              if (clientUpdateErr) {
                console.error(`Error updating client ${client_id} with new service date:`, clientUpdateErr);
                return;
              }
              console.log(`Client ${client_id} updated with new service date: ${nextServiceDate}`);
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
          console.log("No tasks found for rescheduling.");
        }

        connection.release();
      });
    });
  } catch (error) {
    console.error("Error in processTasks function:", error.message);
  }
};

module.exports = { processTasks };
