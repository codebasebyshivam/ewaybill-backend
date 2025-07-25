import express from 'express';
// created express application
const app = express();
import dotenv from 'dotenv';
dotenv.config();
// built in package middlewares imports

import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { errorMiddleware, createError } from './middleware/error.handler.js';
import handleLogin from './controllers/login.js';
import handleCompanies from './controllers/companies.js';
import handleFinancialYears from './controllers/financial.years.js';

// server port
const SERVER_PORT = process.env.SERVER_PORT || 5500;

// built in middleware
app.use(cookieParser());

// defined cors policy
const corsoption = {
  origin: [`http://localhost:5178`],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Enable CORS
app.use(cors(corsoption));
// Handle preflight requests
// app.options('*', cors(corsoption));

app.use(helmet());
app.use(express.json({ limit: '10mb' }));

// routes
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
