const pool = require("../Utils/db.js");
const reponse = require("../GlobalResponse/RESPONSE");
const logger = require("../logger");


const GlobalUpdate = (payload, res) => {
  let keys = Object.keys(payload.databaseFields);
  let values = Object.values(payload.databaseFields);
  
  try {
    pool.getConnection(async (err, connection) => {
      if (err) {
        // // logger.info("eror while creating connection", err);
        return res.send(reponse(false, "database error", {}));
      }
      let query = `UPDATE ${payload.tableName} SET  ${keys.join(
        " = ? ,"
      )} = ? where id = ${payload.id}`;
      //   let params=[keys,values,payload.id]
      connection.query(query, values, (err, result) => {
        connection.release();

        if (err) {
          // // logger.info(err);
          return res.status(400).send(reponse(false, `error while updating in ${payload.tableName}`, err));
        } else {
          return res
            .status(200)
            .send(reponse(true, `succesfully updated in ${payload.tableName}`, result));
        }
      });
    });
  } catch (err) {
    return res.send(reponse(false, err.message, err));
  }
};
module.exports = { GlobalUpdate };
