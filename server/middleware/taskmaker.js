const pool = require("../Utils/db");
const tableName = require("../Utils/allTableNames");

const mytask = async () => {
  try {
    const query = `
      SELECT id, upcoming_service_date, plan 
      FROM ${tableName.clients} 
      WHERE DATEDIFF(upcoming_service_date, CURDATE()) = 2
    `;

    // Use pool.query for automatic connection handling
    pool.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching data from clients table:", err);
        return;
      }

      if (results.length > 0) {
        console.log(`Found ${results.length} clients with upcoming services.`);

        const tasks = results.map((item) => ({
          client_id: item.id,
          service_date: item.upcoming_service_date,
          plan: item.plan,
        }));

        // Insert tasks into the database
        const insertQuery = `INSERT INTO ${tableName.tasks} (client_id, service_date, plan) VALUES ?`;

        const values = tasks.map((task) => [
          task.client_id,
          task.service_date,
          task.plan,
        ]);

        pool.query(insertQuery, [values], (insertErr, insertResults) => {
          if (insertErr) {
            console.error("Error inserting task records:", insertErr);
            return;
          }

          console.log(
            `Successfully created ${insertResults.affectedRows} tasks.`
          );
        });
      } else {
        console.log("No clients with upcoming services within 2 days.");
      }
    });
  } catch (error) {
    console.error("Error in mytask cron job:", error.message);
  }
};

module.exports = { mytask };
