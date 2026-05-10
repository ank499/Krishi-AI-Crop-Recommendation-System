/**
 * Global error handler — returns structured JSON error responses.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.status || err.statusCode || 500;
  const isDev  = process.env.NODE_ENV !== 'production';

  console.error(`[Krishi Error] ${status} — ${err.message}`);
  if (isDev) console.error(err.stack);

  res.status(status).json({
    success: false,
    error:   err.message || 'Internal server error',
    ...(isDev && { stack: err.stack }),
  });
}

module.exports = errorHandler;
