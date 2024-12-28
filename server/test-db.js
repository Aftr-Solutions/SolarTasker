const mysql = require("mysql2");

// Database configuration
const dbConfig = {
    host: "s13.hosterpk.com", // Shared IP from cPanel
    user: "digita87_muddassir", // Your database username
    password: "Developers000$$$", // Your database password
    database: "digita87_SolarTasker", 

};


// Create a connection
const connection = mysql.createConnection(dbConfig);

// Test the connection
connection.connect((err) => {
    if (err) {
        console.error("Database connection failed!");
        console.error("Error Code:", err.code);
        console.error("Error Message:", err.message);
        console.error("Error Stack:", err.stack);
    } else {
        console.log("Database connection successful!");
    }
    connection.end(); // Close the connection
});
