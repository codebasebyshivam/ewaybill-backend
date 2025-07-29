import { createError } from '../middleware/error.handler.js';
import queryDatabase from '../services/sql.query.executor.js';

const handleFinancialYears = async (req, res, next) => {
  try {
    const { id } = req.body;
    // Construct the SQL query string
    const query = `select id, Comp_id, FINENCIAL_YEAR [FY]  ,dbname from COMPONY_FIN_YEAR  where comp_id=${id} order by FINENCIAL_YEAR desc`;
    const financialYears = await queryDatabase(
      'LBMMAIN-DELHI',
      query,
      {},
      false
    );
    return res.status(200).json({ financial_years: financialYears });
  } catch (error) {
    console.error(`error in fetching  financial years ${error}`);
    return next(createError(
      'failed to load financial year',
      500,
      'SERVER_ERROR'
    ));
  }
};

export default handleFinancialYears;
