import dotenv from "dotenv";
dotenv.config();

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    // ssl: {
    //     rejectUnauthorized: true
    // }
};

export default config;