import express from 'express';
const app = express();
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import http from 'http';
import { errorMiddleware,createError } from './middleware/error.handler.js';

// server port
const SERVER_PORT = process.env.SERVER_PORT || 5500;

// cors config
const CORSOPTION = {
  origin: ['http://localhost:5178', `http://192.168.1.37:5178`],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE'],
  allowedHeaders: ['Content-type', 'Authorization'],
};

// built in middlewares
app.use(cors(CORSOPTION));
app.use(cookieParser());
app.use(helmet());
app.use(express.json({ limit: '10mb' }));



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

// Graceful SHUTDOWN logic hit when user press ctrl + c
process.on('SIGINT', async () => {
  console.log(`Shutting down the server`);
  server.close(() => {
    console.log('server closed.');
    process.exit(0);  // Exit the process gracefully
  });
})


// process is closed by operation system
process.on('SIGTERM', async () => {
  console.log(`Shutting down the server`);
  server.close(() => {
    console.log('server closed.');
    process.exit(0);  // Exit the process gracefully
  });
});

// The uncaughtException event is emitted when an exception is thrown but not caught by a try-catch block anywhere in the application
process.on('uncaughtException', async (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);  // Exit the process with an error status code
});


// The unhandledRejection event is triggered when a Promise is rejected and there’s no .catch() block to handle it.
process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);  // Exit the process with an error status code
});



// routes





// Catch wrong routes (404 handler)
app.use((req, res, next) => {
  next(createError('Route Not Matched', 404, 'NOT_FOUND'));
});



// custom middleware
app.use(errorMiddleware); //error middleware