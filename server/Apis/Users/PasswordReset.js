const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const tableNames = require("../../Utils/allTableNames");
const RESPONSE = require("../../GlobalResponse/RESPONSE");
const pool = require("../../Utils/db");
const sendUserCredentials = require("../../middleware/sendMail"); // Assuming you have this function for sending emails

router.post("/", (req, res) => {
  const userId = req.body.userId;
  const newPassword = req.body.newPass;

  // Hash the new password
  bcrypt.hash(newPassword, 14, function (err, hash) {
    if (err) {
      return res.json({
        message: "Error while hashing",
        error: err,
      });
    } else {
      // Query to update the password
      const updateQuery = `UPDATE ${tableNames.owners} SET password='${hash}' WHERE id=${userId}`;
      // Query to get the user's email and username
      const selectQuery = `SELECT email, user_name FROM ${tableNames.owners} WHERE id=${userId}`;

      try {
        pool.getConnection((err, connection) => {
          if (err) {
            return res.send(RESPONSE(false, "Database connection error", {}));
          }

          // Execute the update query
          connection.query(updateQuery, (err, result) => {
            if (err) {
              connection.release();
              return res.send(RESPONSE(false, "Error while updating password", {}));
            }

            // Execute the select query to fetch email and username
            connection.query(selectQuery, (err, userResult) => {
              connection.release();
              if (err) {
                return res.send(RESPONSE(false, "Error while fetching user details", {}));
              }

              if (userResult.length > 0) {
                const { email, user_name } = userResult[0];

                // Send the reset password email
                sendUserCredentials(email, user_name, newPassword, req, res);

                return res.send(RESPONSE(true, "Password reset successfully", result));
              } else {
                return res.send(RESPONSE(false, "User not found", {}));
              }
            });
          });
        });
      } catch (err) {
        return res.send(RESPONSE(false, err.message, err));
      }
    }
  });
});

module.exports = router;
