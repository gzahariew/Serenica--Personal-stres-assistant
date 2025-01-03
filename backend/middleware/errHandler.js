export const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
  
    // Determine the status code
    const statusCode = err.statusCode || 500;
  
    // Send a consistent error response
    res.status(statusCode).json({
      error: {
        message: err.message || 'Internal Server Error',
      },
    });
  };
  