import queryDatabase from '../services/sql.query.executor.js';

const apiCountTracker = async (api_name, username, db_name) => {
  try {
    const procedureName = `usp_Insert_TBL_T_APICOUINT`;

    const params = {
      API_NAME: api_name,
      USERNAME: username,
      DB_SOURCE: 0,
      API_SOURCE: 1,
    };
    //    execute the query
    await queryDatabase(db_name, procedureName, params);
  } catch (error) {
    throw error;
  }
};

export { apiCountTracker };
