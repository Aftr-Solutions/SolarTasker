const pool = require("../Utils/db");
const reponse = require("../GlobalResponse/RESPONSE");

const GlobalSelect = (payload, res) => {
  try {
    // console.log(payload);
    pool.getConnection((err, connection) => {
      if (err) {
        // console.log("eror while creating connection", err);
        res.send(reponse(false, "database error", {}));
        throw err;
        // return
      }
      connection.query(
        `SELECT * FROM ${payload.tableName} ORDER BY id DESC`,
        (err, result) => {
          connection.release();

          if (err) {
            // console.log(err);
            return res.send(reponse(false, "error while selecting", err));
          } else {
            // console.log(result);
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
  // console.log("payload",payload);
  try {
    pool.getConnection((err, connection) => {
      if (err) {
        // console.log("eror while creating connection", err);
        return res.send(reponse(false, "database error", {}));
      }
      connection.query(
        `SELECT ${payload.select} FROM ${payload.tableName} where ${payload.key}="${payload.value}" ORDER BY id DESC`,
        (err, result) => {
          connection.release();

          if (err) {
            // console.log(err);
            return res.send(reponse(false, "error while selecting", err));
          } else {
            // console.log(result);
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
    // console.log("payload >>>>", payload);
    pool.getConnection((err, connection) => {
      if (err) {
        // // console.log("eror while creating connection", err);
        return res.send(reponse(false, "database error", {}));
      }
      connection.query(
        `SELECT ${payload.select} FROM ${payload.tableName} where ${payload.key}="${payload.value}"`,
        (err, result) => {
          connection.release();

          if (err) {
            // // console.log(err);
            return res.send(reponse(false, "error while selecting", err));
          } else {
            // // // console.log(result);
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
