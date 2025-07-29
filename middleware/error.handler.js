const ERROR_CODES = {
  VALIDATION_ERROR: { message: 'Validation failed', statusCode: 400 },
  BAD_REQUEST: { message: 'Bad Request', statusCode: 400 },
  UNPROCESSABLE_ENTITY: { message: 'Unprocessable Entity', statusCode: 422 },
  UNAUTHORIZED: { message: 'Unauthorized access', statusCode: 401 },
  FORBIDDEN: { message: 'Forbidden access', statusCode: 403 },
  NOT_FOUND: { message: 'Resource not found', statusCode: 404 },
  METHOD_NOT_ALLOWED: { message: 'Method Not Allowed', statusCode: 405 },
  NOT_ACCEPTABLE: { message: 'Not Acceptable', statusCode: 406 },
  REQUEST_TIMEOUT: { message: 'Request Timeout', statusCode: 408 },
  CONFLICT: { message: 'Duplicate Value inserted', statusCode: 409 },
  UNSUPPORTED_MEDIA_TYPE: {
    message: 'Unsupported Media Type',
    statusCode: 415,
  },
  TOOMANYREQUEST: { message: 'Too Many Requests', statusCode: 429 },
  SERVER_ERROR: { message: 'Internal server error', statusCode: 500 },
  SERVICE_UNAVAILABLE: { message: 'Service Unavailable', statusCode: 503 },
  GATEWAY_TIMEOUT: { message: 'Gateway Timeout', statusCode: 504 },
  No_CHANGES_MADE: { message: 'No Changes Made', statusCode: 204 },
  PAYMENT_REQUIRED: { message: 'Payment Required', statusCode: 402 },
};

const createError = (
  message,
  statusCode = 500,
  errorCode = 'SERVER_ERROR',
  details = null
) => ({
  success: false,
  statusCode,
  error: {
    errorCode,
    message,
    details,
  },
  timestamp: new Date().toISOString(),
});

const errorMiddleware = (err, req, res, next) => {
  console.error(`error middleware `,err);

  const statusCode = err.statusCode || 500;
  const error = err.error || {
    errorCode: 'SERVER_ERROR',
    message: 'Internal server error',
    details: null,
  };

  return res.status(statusCode).json({
    success: false,
    statusCode,
    error,
  });
};

export { ERROR_CODES, createError, errorMiddleware };
