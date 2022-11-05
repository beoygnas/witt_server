import config from "./dbconfig.js";
import pg from "pg";


console.log(config.host);
const pool = new pg.Pool(config);

async function query(query, values) {

    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release(true);
    return result;
}
export { query };