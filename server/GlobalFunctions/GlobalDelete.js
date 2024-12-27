const pool = require("../Utils/db");
const response = require("../GlobalResponse/RESPONSE");

const GlobalDelete = (payload, res) => {
  try {
    pool.getConnection((err, connection) => {
      if (err) {
        // // console.log("eror while creating connection", err);
        return res.send(response(false, "database error", {}));
      }
      connection.query(
        `DELETE FROM ${payload.tableName} WHERE id =${payload.databaseFields.id}`,
        (err, result) => {
          connection.release();

          if (err) {
            // // console.log(err);
            return res.send(response(false, "error while deleting", err));
          } else {

            // // // console.log(result);
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
