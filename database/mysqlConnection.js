
const mysql = require('mysql2');
const dotenv = require('dotenv').config();

// Use createPool instead of createConnection for better scalability
const connection = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD, // Use uppercase for consistency
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0

    // host :"localhost",
    // user:"root",
    // password:"152897",
    // database:"techiefreight"
   

});

// Testing the database connection
connection.getConnection((error, connection) => {
    if (error) {
        console.error('Database connection failed:', error.message);
    } else {
        console.log('Database connected successfully');
        connection.release();
    }
});

// Handle errors on the connection
connection.on('error', (err) => {
    console.error('Database connection error:', err.message);
});

module.exports = { connection };
