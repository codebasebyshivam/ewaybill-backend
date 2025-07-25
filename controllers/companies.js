import { createError } from '../middleware/error.handler.js';
import queryDatabase from '../services/sql.query.executor.js';

const handleCompanies = async (req, res) => {
  try {
    // Construct the SQL query string
    const query = `select id, m_compname [Company] from comp_details order by m_compname`;
    const companies = await queryDatabase('LBMMAIN-DELHI', query, {}, false);

    return res.status(200).json({ success: true, cmp_list: companies });
  } catch (error) {
    console.error(`error in fetching companies with financial year ${error}`);
    const errorResponse = createError(
      'failed to load companies',
      500,
      'SERVER_ERROR'
    );
    return res.status(500).json(errorResponse);
  }
};

export default handleCompanies;
