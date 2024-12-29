const pool = require("../Utils/db");
const response = require("../GlobalResponse/RESPONSE");
// this function is for create global

const GlobalInsert = (payload, res) => {
  try {
    pool.getConnection(async (err, connection) => {
      if (err) {
        console.log("eror while creating connection", err);
        return res.send(response(false, "database error", {}));
      }
      connection.query(
        `INSERT INTO ${payload.tableName} SET ?`,
        payload.databaseFields,

        (err, result) => {
          connection.release();

          if (err) {
            // // console.log("database");
            console.log(err);
            return res.send(response(false, "error while inserting", {}));
          } else {
            // // console.log("result");

            return res.send(response(true, "succesfully added", result));
          }
        }
      );
    });
  } catch (err) {
    return res.send(response(false, err.message, err));
  }
};

module.exports = { GlobalInsert };
