import dotenv from 'dotenv';
dotenv.config();

const config = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  port: process.env.MYSQL_PORT,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  // ssl: {
  //     rejectUnauthorized: true
  // }
};

export default config;
