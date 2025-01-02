  const express = require("express");
  const router = express.Router();
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");
  const RESPONSE = require("../../GlobalResponse/RESPONSE");
  const tableNames = require("../../Utils/allTableNames");
  const pool = require("../../Utils/db");

  router.post("/", (req, res) => {
    let user_name = req.body.username;
    let password = req.body.password;

    let payload = {
      tableName: tableNames.owners,
      select: "*",
      key: "user_name",
      value: user_name,
    };
    try {
      pool.getConnection((err, connection) => {
        if (err) {
          return res.send(RESPONSE(false, "database error", {}));
        }
        connection.query(
          `SELECT ${payload.select} FROM ${payload.tableName} where ${payload.key}="${payload.value}"`,
          (err, data) => {
            connection.release();

            if (err) {
              return res.send(RESPONSE(false, "error while selecting", err));
            } else {
              if (data.length < 1) {
                return res
                  .status(404)
                  .send(
                    RESPONSE(
                      false,
                      "user not found some issues in authentication",
                      {}
                    )
                  );
              } else {
                bcrypt.compare(
                  password,
                  data[0].password,(error, result) => {
                    if (result === false) {
                      return res
                        .status(401)
                        .send(
                          RESPONSE(false, "Auth failed because wrong password", err)
                        );
                    }
                    if (error) {
                      return res
                        .status(401)
                        .send(
                          RESPONSE(false, "Auth failed, bcr wrong password", err)
                        );
                    }
                    if (result) {
                      let token = jwt.sign(
                        {
                          id: data[0].id,
                          username: data[0].user_name,
                          email: data[0].email,
                        },
                        "pksectret",
                        {
                          expiresIn: "100h",
                        }
                      );
                      res.status(200).json({
                        message: "Login Successfully",
                        token: token,
                        user: data,
                      });
                    }
                  }
                );
              }
            }
          }
        );
      });
    } catch (err) {
      return res.send(RESPONSE(false, err.message, err));
    }
  });

  module.exports = router;
