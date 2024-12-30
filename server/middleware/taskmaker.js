const pool = require("../Utils/db");
const tableName = require("../Utils/allTableNames");

const mytask = async () => {
  try {
    // SQL query to fetch clients with upcoming service dates within the next 2 days
    const query = `
      SELECT id, upcoming_service_date, plan 
      FROM ${tableName.clients} 
      WHERE DATEDIFF(upcoming_service_date, CURDATE()) <= 2
    `;

    // Get a connection from the pool
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting database connection:", err);
        return;
      }

      // Fetch the clients
      connection.query(query, (err, results) => {
        if (err) {
          console.error("Error fetching data from clients table:", err);
          connection.release(); // Ensure connection is released
          return;
        }

        if (results.length > 0) {
          console.log(`Found ${results.length} clients with upcoming services.`);

          // Process each client and insert into tasks
          results.forEach((item) => {
            const taskData = {
              client_id: item.id,
              service_date: item.upcoming_service_date,
              plan: item.plan,
            };

            const insertQuery = `INSERT INTO ${tableName.tasks} SET ?`;

            // Insert the task into the tasks table
            connection.query(insertQuery, taskData, (insertErr, insertResults) => {
              if (insertErr) {
                console.error("Error inserting task record:", insertErr);
                return;
              }

              console.log("Task created successfully:", taskData);
            });
          });
        } else {
          console.log("No clients with upcoming services within 2 days.");
        }

        connection.release(); // Release the connection after processing
      });
    });
  } catch (error) {
    console.error("Error in mytask cron job:", error.message);
  }
};

module.exports = {mytask};
