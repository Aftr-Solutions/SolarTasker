const pool = require("../Utils/db");
const response = require("../GlobalResponse/RESPONSE");
const logger = require("../logger");


const GlobalDelete = (payload, res) => {
  try {
    pool.getConnection((err, connection) => {
      if (err) {
        // // logger.info("eror while creating connection", err);
        return res.send(response(false, "database error", {}));
      }
      connection.query(
        `DELETE FROM ${payload.tableName} WHERE id =${payload.databaseFields.id}`,
        (err, result) => {
          connection.release();

          if (err) {
            // // logger.info(err);
            return res.send(response(false, "error while deleting", err));
          } else {

            // // // logger.info(result);
            return res.send(response(true, "succesfully deleted", {}));
          }
        }
      );
    });
  } catch (err) {
    return res.send(response(false, err.message, err));
  }
};

module.exports = { GlobalDelete };
