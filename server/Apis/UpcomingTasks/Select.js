const express = require("express");
const router = express.Router();
const tableName = require("../../Utils/allTableNames");
const RESPONSE = require("../../GlobalResponse/RESPONSE");
const logger = require("../../logger");
const pool = require("../../Utils/db");

router.get("/", (req, res) => {
  try {
    pool.getConnection((err, connection) => {
      if (err) {
        // Log the error and send a proper response
        logger.error("Error while creating database connection:", err);
        return res.send(RESPONSE(false, "Database connection error", {}));
      }

      const query = `
  SELECT 
      t.id AS task_id,
      t.service_date,
      t.created_at,
      te.team_name,
      t.response,
      t.isactive,
      t.task_status,
      c.name,
      c.number
  FROM ${tableName.tasks} t
  INNER JOIN ${tableName.clients} c ON c.id = t.client_id INNER JOIN ${tableName.team} te on te.id=t.team_id
  WHERE t.isactive = 0
  ORDER BY t.id DESC;
`;

      connection.query(query, (err, result) => {
        connection.release(); // Ensure the connection is released

        if (err) {
          // Log the error and send a proper response
          logger.error("Error while executing query:", err);
          return res.send(RESPONSE(false, "Error while selecting data from Tasks", err));
        }
        
        result.forEach(item=>{
          item.service_date=moment(item.service_date).format('DD/MM/YYYY');
          item.created_at=moment(item.created_at).format("DD/MM/YYYY")
        });
        
        // Log the result and send a success response
        logger.info("Successfully fetched tasks:", result);
        return res.send(RESPONSE(true, "Successfully selected record from Tasks", result));
      });
    });
  } catch (err) {
    // Log any unexpected errors
    logger.error("Unexpected error in route handler:", err);
    return res.send(RESPONSE(false, err.message, err));
  }
});

module.exports = router;
