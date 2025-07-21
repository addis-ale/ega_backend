export const errorMiddleware = (error, req, res, next) => {
  const statusCode = error.statusCode || 500; // default to 500 if undefined

  res.status(statusCode).json({
    message: error.message || "Internal Server Error",
    errorCode: error.errorCode || "SERVER_ERROR",
    errors: error.errors || [],
  });
};
