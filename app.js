import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';

import { errorMiddleware, createError } from './middleware/error.handler.js';
import handleLogin from './controllers/login.js';
import handleCompanies from './controllers/companies.js';
import handleFinancialYears from './controllers/financial.years.js';
import jwt from 'jsonwebtoken';
import { create } from 'domain';

// server port
const SERVER_PORT = process.env.SERVER_PORT || 5500;

// built in middleware
app.use(cookieParser());

// defined cors policy
const corsoption = {
  origin: [`http://localhost:5178`,`http://192.168.1.36:4173`],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Enable CORS
app.use(cors(corsoption));
app.use(helmet());
app.use(express.json({ limit: '10mb' }));

// routes
app.get('/api/me', async (req, res, next) => {
  const token = req.cookies?.sessionId;
  console.log('Token from cookies:', token);

  if (!token) throw createError('No session exist', 401, 'UNAUTHORIZED', 'You must be logged in to access this resource');

  try {
    const user = jwt.verify(token, process.env.SECRET_KEY);
    return res.status(200).json(user);
  } catch (error) {
    console.error(`Error verifying token: ${error.message}`);
    // Use your central error handler
    if (!error?.statusCode) {
      // Not a custom error, wrap it
      return next(
        createError(
          `Invalid or session expired`,
          500,
          'UNAUTHORIZED',
          'Please log in again'
        )
      );
    }
    // already structured error
    return next(error);
  }
});


app.get('/api/logout', async (req, res, next) => {
  try {
    // Clear the cookie that contains the JWT
    res.clearCookie('sessionId', {
      httpOnly: true,
      secure: true,         // use only over HTTPS
      sameSite: 'None',     // important for cross-origin requests
    });

    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    next(createError('Failed to log out',500,'SERVER_ERROR','An error occurred while logging out'));
  }
});

app.get('/api/companies-list', handleCompanies);
app.post('/api/financial-years', handleFinancialYears);
app.post('/api/login', handleLogin);



// Catch wrong routes (404 handler)
app.use((req, res, next) => {
  next(createError('Route Not Matched', 404, 'NOT_FOUND'));
});

// custom middleware
app.use(errorMiddleware); //error middleware

// server created
const server = http.createServer(app);

// server listenting
server.listen(SERVER_PORT, '0.0.0.0', (error) => {
  if (error) console.error(`error in listening server at port ${SERVER_PORT}`);
  const server_details = server.address(); //get the server address info
  console.log(
    `server is listening at port ${server_details.port} and ip address ${server_details.address}`
  );
});
