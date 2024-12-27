const mysql = require("mysql2");

const pool = mysql.createPool({
  // NEW HOSTING
  host: "http://www.solarcleaner.pk:2082/",//"127.0.0.1",//"s13.hosterpk.com",
  user: "solarcle_shahroz",//"root",//"digita87_muddassir",
  password:"Shahroz$$$000", //"",//"Developers000$$$",
  database: "solarcle_SolarTasker"//"solar"//"digita87_NewCenterline"
});

module.exports = pool;



