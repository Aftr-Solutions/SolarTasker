const mysql = require("mysql2");
const { logWithOptionalBroadcast } = require("../logger");
const RESPONSE=require("../GlobalResponse/RESPONSE");
const dotenv = require("dotenv");
//const moment=require("moment-timezone");

dotenv.config();

const pool = mysql.createPool({
  host:process.env.DB_HOST,
  user:process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  database:process.env.DB_NAME,
});
pool.getConnection((err, connection) => {
  if (err) {
    // console.log("ENV",process.env.DB_HOST,process.env.DB_USER,process.env.DB_PASSWORD,process.env.DB_NAME);
    logWithOptionalBroadcast('error',`Database connection error:, err`);
    return; // Remove any attempt to use `res` here
  }
  logWithOptionalBroadcast('info',"Database connection successful");
  connection.release(); // Always release the connection back to the pool
});
module.exports = pool;
