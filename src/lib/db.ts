import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'employeemanagementpro',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('MySQL connection pool created');

export const query = async (sql: string, params?: any[]) => {
  try {
    console.log('Executing query:', sql);
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

export default pool;