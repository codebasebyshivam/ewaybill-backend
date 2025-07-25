import sql from 'mssql';
import 'dotenv/config';

const createPool = async (databaseName) => {
  try {
    const pool = new sql.ConnectionPool({
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      server: process.env.SQL_IP_ADDRESS,
      database: databaseName,
      options: {
        encrypt: true,
        trustServerCertificate: true,
        connectTimeout: 30000, // 30 seconds timeout
        requestTimeout: 30000, // 30 seconds timeout
      },
    });

    // console.log({
    //   user: process.env.SQL_USER,
    //   password: process.env.SQL_PASSWORD,
    //   server: process.env.SQL_IP_ADDRESS,
    //   database: databaseName,
    //   options: {
    //     encrypt: true,
    //     trustServerCertificate: true,
    //     connectTimeout: 30000, // 30 seconds timeout
    //     requestTimeout: 30000, // 30 seconds timeout
    //   },
    // });

    await pool.connect();
    console.log('Successfully connected to SQL Server');
    return pool;
  } catch (error) {
    console.log('error in creating pool', error);
    throw error;
  }
};

export default createPool;
