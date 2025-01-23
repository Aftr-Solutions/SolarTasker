const pool = require("../Utils/db");
const response = require("../GlobalResponse/RESPONSE");
const logger = require("../logger");


const GlobalDelete = (payload, res) => {
  try {
    pool.getConnection((err, connection) => {
      if (err) {
        // // logger.info("eror while creating connection", err);
        return res.status(500).send(response(false, "Error While Connecting With Database", {}));
      }
      connection.query(
        `DELETE FROM ${payload.tableName} WHERE id =${payload.databaseFields.id}`,
        (err, result) => {
          connection.release();

          if (err) {
            // // logger.info(err);
            return res.status(500).send(response(false, `Error While Deleting Data In ${payload.table}`, err));
          } else {

            // // // logger.info(result);
            return res.status(200).send(response(true, `Data Has Been Successfully Deleted From ${payload.table}`, {}));
          }
        }
      );
    });
  } catch (err) {
    return res.status(401).send(response(false, err.message, err));
  }
};

module.exports = { GlobalDelete };
