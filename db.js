let mysql = require('mysql');
require("dotenv").config();

const con = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,   // number of parallel connections
  connectTimeout: 10000, // 10s timeout
  waitForConnections: true,
  queueLimit: 0
});

function first() {
  // No need to call con.connect() with a pool
  console.log("Pool created, ready to query!");

  con.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      name VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    `, function (err) {
    if (err) throw err;
  });

  
  con.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      text TEXT NOT NULL,
      username VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    `, function (err) {
    if (err) throw err;
  });




}



// docker exec -it darbalsalaf_db mysql -u root -p
// password: Fawaz123456#
//SHOW DATABASES;
//USE darbalsalaf_db;
//SHOW TABLES;


////////////////////////////////////////
// 🔹 Export all functions
////////////////////////////////////////
module.exports = {
  first,
  con
};