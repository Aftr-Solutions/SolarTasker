require('dotenv').config();
const mysql = require('mysql2');
const logger = require("../server/logger");

// Database configuration
const dbConfig = {
  //host:"148.163.69.162",//"s13.hosterpk.com", // Shared IP from cPanel
  //user:"solarcle_shahroz",//"digita87_muddassir", // Your database username
  //password:"Shahroz$$$000", //"Developers000$$$", // Your database password
  //database: "solarcle_SolarTasker",
  //port: process.env.DB_PORT || , // Default to 3306 if not provided
  //connectTimeout: 10000, // 10 seconds
  // hosterpk
  host:"s13.hosterpk.com" || process.env.DB_HOST,
  user:"digita87_muddassir" || process.env.DB_UDER,
  password:"Developers000$$$" || process.env.DB_PASSWORD,
  database:"digita87_SolarTasker" || process.env.DB_NAME,
  connectionLimit: 10, // Maximum number of connections in the pool
  //connectTimeout: 10000,      // Connection timeout in milliseconds
  waitForConnections: true, // Wait for available connections in the pool
  queueLimit: 0, // No limit on the number of queued requests
  //idleTimeout: 60000, // 60 seconds (adjust as needed)
};

// Create a connection
const connection = mysql.createConnection(dbConfig);

// Test the connection
connection.connect((err) => {
  if (err) {
    logger.error("Database connection failed!");
    logger.error("Error Code:", err.code);
    logger.error("Error Message:", err.message);
    logger.error("Error Stack:", err.stack);
    return; // Exit without attempting to end the connection
  }
  logger.info("Database connection successful!");
  connection.end(); // Close the connection if successful
});
