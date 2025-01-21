const express = require("express");
const router = express.Router();
const tableName = require("../../Utils/allTableNames");
const RESPONSE = require("../../GlobalResponse/RESPONSE");
const logger = require("../../logger");
const { pool } = require("../../Utils/crondb");

router.post("/", (req, res) => {
  try {
    // Validate required fields
    const {
      client_id,
      team_id,
      response,
      task_status,
      name,
      number,
      service_date,
    } = req.body;

    if (
      !client_id ||
      !team_id ||
      response === undefined || // Allow `0` as valid response
      task_status === undefined || // Allow `0` as valid task_status
      !name ||
      !number ||
      !service_date
    ) {
      return res
        .status(400)
        .send(RESPONSE(false, "Please fill all required fields", {}));
    }

    // Establish a connection
    pool.getConnection((err, connection) => {
      if (err) {
        logger.error("Error while creating database connection:", err);
        return res
          .status(500)
          .send(RESPONSE(false, "Database connection error", {}));
      }

      // Insert new task
      const insertQuery = `
        INSERT INTO ${tableName.tasks} 
        (client_id, service_date, team_id, response, task_status, name, number) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const payload = [
        client_id,
        service_date,
        team_id,
        response,
        task_status,
        name,
        number,
      ];

      connection.query(insertQuery, payload, (insertErr, insertResult) => {
        if (insertErr) {
          connection.release();
          logger.error("Error while executing insert query:", insertErr);
          return res
            .status(500)
            .send(RESPONSE(false, "Error while inserting new task", insertErr));
        }

        // Update the `re_task_done` status
        const updateQuery = `
          UPDATE ${tableName.tasks} 
          SET re_task_done = 1 
          WHERE id = ?
        `;

        connection.query(updateQuery, [id], (updateErr, updateResult) => {
          connection.release(); // Release connection after the final query
          if (updateErr) {
            logger.error("Error while executing update query:", updateErr);
            return res
              .status(500)
              .send(
                RESPONSE(
                  false,
                  "Error while updating re_task_done for missed task",
                  updateErr
                )
              );
          }

          // Log success and send response
          logger.info("Successfully retasked missed task:", {
            insertResult,
            updateResult,
          });
          return res.send(
            RESPONSE(
              true,
              "Successfully retasked missed task and updated re_task_done",
              { insertResult, updateResult }
            )
          );
        });
      });
    });
  } catch (err) {
    logger.error("Unexpected error in retask route:", err);
    return res
      .status(500)
      .send(RESPONSE(false, "Unexpected error occurred", err));
  }
});

module.exports = router;
