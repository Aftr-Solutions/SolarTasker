const mysql = require("mysql2");

const pool = mysql.createPool({
  // NEW HOSTING
  host: "127.0.0.1",//"s13.hosterpk.com",
  user: "root",//"digita87_muddassir",
  password: "",//"Developers000$$$",
  database: "solar"//"digita87_NewCenterline"
});

module.exports = pool;



