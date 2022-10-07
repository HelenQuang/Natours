const AppError = require("../utils/appError");

const handleCastErrDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErrDB = (err) => {
  const value = Object.values(err.keyValue)[0];
  const message = `${value} is already existed. Please try another value`;
  return new AppError(message, 400);
};

const handleValidationErrDB = (err) => {
  const errorMessages = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errorMessages.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrProd = (err, res) => {
  //Operational, trusted error => send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //Programming or unknown error => don't show error details
    console.error("ERROR", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

//GLOBAL ERROR HANDLING MIDDLEWARE
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error.name === "CastError") {
      error = handleCastErrDB(error);
    }

    if (error.code === 11000) {
      error = handleDuplicateErrDB(error);
    }

    if (error._message === "Validation failed") {
      error = handleValidationErrDB(error);
    }

    sendErrProd(error, res);
  }
};
