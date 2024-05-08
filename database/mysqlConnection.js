const mysql = require("mysql2");
const dotenv = require("dotenv").config();

// Use createPool instead of createConnection for better scalability
const connection = mysql.createPool({
  host: "149.100.151.222",
  user: "u702021491_woolfr",
  password: "U:Rta|M1o", // Use uppercase for consistency
  database: "u702021491_woolfr",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // host :"localhost",
  // user:"root",
  // password:"152897",
  // database:"techiefreight"
});

// $C['DB_HOST'] = "149.100.151.222";                                //localhost or your db host
// $C['DB_USER'] = "u702021491_woolfr";                             //your db user
// $C['DB_PASS'] = "U:Rta|M1o";                         //your db password
// $C['DB_NAME'] = "u702021491_woolfr";

// Testing the database connection
connection.getConnection((error, connection) => {
  if (error) {
    console.error("Database connection failed:", error.message);
  } else {
    console.log("Database connected successfully");
    connection.release();
  }
});

// Handle errors on the connection
connection.on("error", (err) => {
  console.error("Database connection error:", err.message);
});

module.exports = { connection };
