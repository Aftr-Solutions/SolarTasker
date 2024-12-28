const mysql = require("mysql2");

const pool = mysql.createPool({
  // NEW HOSTING
  host: "s13.hosterpk.com", // Shared IP from cPanel
  user: "digita87_muddassir", // Your database username
  password: "Developers000$$$", // Your database password
  database: "digita87_SolarTasker"
});


module.exports = pool;



