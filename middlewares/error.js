const errorHandler = (err, req, res, next) => {
  // Log to console for dev
  console.log("<<<<<My stacktrace>>>>", err.stack);

  console.log(`Custom Error: ${err.name}`);

  if (err.name && err.name === "UserExistsError") {
    res.status(501).json({
      success: false,
      status: 501,
      data: {
        message: "Email already exist. Use another",
        error: "Email already exist. Use another",
      },
    });

    return;
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    data: {
      message: "A server error occured",
      error: err.message || "Server Error",
    },
  });
};

module.exports = errorHandler;
