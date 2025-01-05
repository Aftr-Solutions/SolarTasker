const pool = require("../Utils/db");
const reponse = require("../GlobalResponse/RESPONSE");
const logger = require("../logger");


const GlobalSelect = (payload, res) => {
  try {
    // logger.info(payload);
    pool.getConnection((err, connection) => {
      if (err) {
        // logger.info("eror while creating connection", err);
        res.send(reponse(false, "database error", {}));
        throw err;
        // return
      }
      connection.query(
        `SELECT * FROM ${payload.tableName} ORDER BY id DESC`,
        (err, result) => {
          connection.release();

          if (err) {
            // logger.info(err);
            return res.send(reponse(false, "error while selecting", err));
          } else {
            // logger.info(result);
            return res.send(reponse(true, "succesfully selected", result));
          }
        }
      );
    });
  } catch (err) {
    return res.send(reponse(false, err.message, err));
  }
};
const GlobalSelectWithWhereClause = (payload, res) => {
  // logger.info("payload",payload);
  try {
    pool.getConnection((err, connection) => {
      if (err) {
        // logger.info("eror while creating connection", err);
        return res.send(reponse(false, "database error", {}));
      }
      connection.query(
        `SELECT ${payload.select} FROM ${payload.tableName} where ${payload.key}="${payload.value}" ORDER BY id DESC`,
        (err, result) => {
          connection.release();

          if (err) {
            // logger.info(err);
            return res.send(reponse(false, "error while selecting", err));
          } else {
            // logger.info(result);
            return res.send(reponse(true, "succesfully selected", result));
          }
        }
      );
    });
  } catch (err) {
    return res.send(reponse(false, err.message, err));
  }
};
const GlobalSelecthWhereCondition = (payload, res) => {
  try {
    // logger.info("payload >>>>", payload);
    pool.getConnection((err, connection) => {
      if (err) {
        // // logger.info("eror while creating connection", err);
        return res.send(reponse(false, "database error", {}));
      }
      connection.query(
        `SELECT ${payload.select} FROM ${payload.tableName} where ${payload.key}="${payload.value}"`,
        (err, result) => {
          connection.release();

          if (err) {
            // // logger.info(err);
            return res.send(reponse(false, "error while selecting", err));
          } else {
            // // // logger.info(result);
            return res.send(reponse(true, "succesfully selected", result));
          }
        }
      );
    });
  } catch (err) {
    return res.send(reponse(false, err.message, err));
  }
};

module.exports = {
  GlobalSelect,
  GlobalSelectWithWhereClause,
  GlobalSelecthWhereCondition,
};
