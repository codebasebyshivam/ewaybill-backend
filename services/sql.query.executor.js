import createPool from '../config/sql.config.js';

// const queryDatabase = async (
//   database_name,
//   procedure_name,
//   params = {},
//   isProcedure = true
// ) => {
//   try {
//     let pool = null;

//     pool = await createPool(database_name);
//     const request = pool.request();

//     Object.keys(params).forEach((key) => {
//       // Add parameters to the request
//       request.input(key, params[key]);
//     });

//     let result;

//     if (isProcedure) {
//       // If it's a stored procedure, execute it
//       result = request.execute(procedure_name);
//     } else {
//       // If it's a regular SQL query, execute the query
//       result = request.query(procedure_name);
//     }

//     await pool.close(); // Ensure the pool is closed after the query
//     return result.recordset;
//   } catch (error) {
//     console.error(`sql query executor error ${error}`);
//     throw error;
//   }
// };

// export default queryDatabase;

const queryDatabase = async (
  databaseName,
  procedureName,
  params = {},
  isProcedure = true
) => {
  let pool = null;
  try {
    pool = await createPool(databaseName);
    const request = pool.request();

    // Add parameters to the request
    Object.keys(params).forEach((key) => {
      request.input(key, params[key]);
    });

    let result;

    if (isProcedure) {
      // If it's a stored procedure, execute it
      result = await request.execute(procedureName);
    } else {
      // If it's a regular SQL query, execute the query
      result = await request.query(procedureName);
    }

    await pool.close(); // Ensure the pool is closed after the query
    return result.recordset;
  } catch (error) {
    console.error('SQL error', error);
    throw error;
  } finally {
    // Ensure the pool is closed even if an error occurs
    if (pool) {
      try {
        await pool.close();
        console.log('Database connection closed');
      } catch (closeError) {
        console.error('Error closing database connection:', closeError.message);
      }
    }
  }
};

export default queryDatabase;
