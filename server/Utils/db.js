const mysql = require("mysql2");
const logger = require("../logger");

const pool = mysql.createPool({
  host: "148.163.69.162" || process.env.DB_HOST, //"s13.hosterpk.com", // Shared IP from cPanel
  user: "solarcle_shahroz" || process.env.DB_UDER, //"digita87_muddassir", // Your database username
  password: "Shahroz$$$000" || process.env.DB_PASSWORD, //"Developers000$$$", // Your database password
  database: "solarcle_SolarTasker" || process.env.DB_NAME, //"digita87_SolarTasker",
  // connectionLimit: 10, // Maximum number of connections in the pool
  // //connectTimeout: 10000,      // Connection timeout in milliseconds
  // waitForConnections: true, // Wait for available connections in the pool
  // queueLimit: 0, // No limit on the number of queued requests
  // //idleTimeout: 60000, // 60 seconds (adjust as needed)

  // hosterpk
  //host:"s13.hosterpk.com" || process.env.DB_HOST,
  //user:"digita87_muddassir" || process.env.DB_UDER,
  //password:"Developers000$$$" || process.env.DB_PASSWORD,
  //database:"digita87_SolarTasker" || process.env.DB_NAME,
  //connectionLimit: 10, // Maximum number of connections in the pool
  //connectTimeout: 10000,      // Connection timeout in milliseconds
  //waitForConnections: true, // Wait for available connections in the pool
  //queueLimit: 0, // No limit on the number of queued requests
  //idleTimeout: 60000, // 60 seconds (adjust as needed)
});
// pool.getConnection((err, connection) => {
//   if (err) {
//     logger.error("Database connection error:", err);
//     return res.status(500).send(RESPONSE(false, "database error", {}));
//   }
//   logger.info("Database connection successful");
// });
module.exports = pool;
