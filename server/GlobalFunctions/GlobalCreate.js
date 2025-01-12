const pool = require("../Utils/db");
const response = require("../GlobalResponse/RESPONSE");
const logger = require("../logger");

// this function is for create global

const GlobalInsert = (payload, res) => {
  try {
    pool.getConnection(async (err, connection) => {
      if (err) {
        logger.info("eror while creating connection", err);
        return res.send(response(false, "database error", {}));
      }
      connection.query(
        `INSERT INTO ${payload.tableName} SET ?`,
        payload.databaseFields,

        (err, result) => {
          connection.release();

          if (err) {
            // // logger.info("database");
            logger.info(err);
            return res.send(response(false, `error while inserting in ${payload.table}`, {}));
          } else {
            // // logger.info("result");

            return res.send(response(true, `succesfully added record in ${payload.table}`, result));
          }
        }
      );
    });
  } catch (err) {
    return res.send(response(false, err.message, err));
  }
};

module.exports = { GlobalInsert };
