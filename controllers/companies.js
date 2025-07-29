import { createError } from '../middleware/error.handler.js';
import queryDatabase from '../services/sql.query.executor.js';

const handleCompanies = async (req, res, next) => {
  try {
    // Construct the SQL query string
    const query = `select id, m_compname [Company] from comp_details order by m_compname`;
    const companies = await queryDatabase('LBMMAIN-DELHI', query, {}, false);

    return res.status(200).json({ success: true, cmp_list: companies });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return next(createError(
      'failed to load companies',
      500,
      'SERVER_ERROR'
    ))
  }
};

export default handleCompanies;
