const sql = require('mysql2/promise');
import { mysql } from '../../../packages/libs/mysql-lib';

module.exports.handler = async (event) => {
  try {
    const pool = sql.createPool(mysql.poolInfo);
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      await connection.beginTransaction();
      await connection.commit();
      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            message: '두 번째 function',
          },
          null,
          2,
        ),
      };
    } catch (err) {
      await connection.rollback();
      console.log(err);
      throw err;
    } finally {
      connection.release();
      pool.end();
    }
  } catch (error) {
    throw new Error(`GET NEW CODI FEED/${error}`);
  }
};
