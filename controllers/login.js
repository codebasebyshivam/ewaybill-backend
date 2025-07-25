import { createError } from '../middleware/error.handler.js';
import queryDatabase from '../services/sql.query.executor.js';
import generateToken from '../utils/generate.login.token.js';

// Helper function to handle successful login
const handleSuccessfulLogin = async (username, db_name) => {
    try {

        // const gstResult = await queryDatabase(db_name, 'usp_get_gstno_Pan');

        // if (!gstResult.length)
        //     throw createError(
        //         'Failed to retrieve company  information',
        //         404,
        //         'NOT_FOUND',
        //         'Unable to fetch company  information'
        //     );

        // const gst = gstResult[0].gstno;
        const isAdmin = username === 'ADMIN';

        // Generate token once
        // const token = generateToken({ username, db_name, gst, isAdmin });
        const token = generateToken({ username, db_name, gst: '07AAJCS3718F1ZC', isAdmin: 'false' });


        return { token, payload: { username, gst: '07AAJCS3718F1ZC', isAdmin } };
    } catch (error) {
        console.error(`❌ Error in handleSuccessfulLogin:`, error);
        throw error?.code
            ? error
            : createError(
                'Login failed due to server error',
                500,
                'SERVER_ERROR',
                error.message
            );
    }
};

const handleLogin = async (req, res, next) => {
    try {
        const { username, password, company, financialYear } = req.body;

        if (!username || !password || !company || !financialYear)
            throw createError(
                'Missing required fields: username, password',
                400,
                'VALIDATION_ERROR',
                'Username, password are required for authentication'
            );

        const [db_name, FY] = financialYear.split('_')[0]; // Extract database name from company string

        // const userResult = await queryDatabase(
        //   db_name,
        //   'usp_get_user_credentials',
        //   { username }
        // );

        // if (!userResult.length)
        //   throw createError(
        //     'User not found',
        //     401,
        //     'UNAUTHORIZED',
        //     'No user found with the provided username'
        //   );

        // const user = userResult[0];


        // Check password
        // if (user.passwd !== String(password) || user.user_name !== username)
        //   throw createError(
        //     'Invalid credentials',
        //     401,
        //     'UNAUTHORIZED',
        //     'Username or password is incorrect'
        //   );


        // const token = await handleSuccessfulLogin(
        //   res,
        //   username,
        //   db_name
        // );

        const { token, payload } = await handleSuccessfulLogin(username, db_name);


        // Set cookie
        return res
            .cookie('token', token, {
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                secure: true,
                sameSite: 'None',
            })
            .status(200)
            .json({ success: true, message: 'Login successful', user_info: { company: company, FY: FY, ...payload } });
    } catch (error) {
        // Use your central error handler
        if (!error?.code) {
            // Not a custom error, wrap it
            return next(
                createError(
                    `Unexpected error occured`,
                    500,
                    'UNEXPECTED_ERROR',
                    error.message
                )
            );
        }

        // Already structured
        return next(error);
    }
};

export default handleLogin;
