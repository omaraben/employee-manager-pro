import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root', // Update with your MySQL user
  password: '', // Update with your MySQL password
  database: 'employee_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('MySQL connection pool created');