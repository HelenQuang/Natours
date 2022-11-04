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

const sendErrDev = (err, req, res) => {
  //Error for API
  if (req.originalUrl.startsWith("/api")) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  //Error for view template
  console.error("ERROR 💥", err);
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message,
  });
};

const sendErrProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    //Operational, trusted error => send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //Programming or unknown error => don't show error details
    console.error("ERROR 💥", err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }

  if (err.isOperational) {
    return res
      .status(err.statusCode)
      .render("error", { title: "Something went wrong!", msg: err.message });
  }

  console.error("ERROR 💥", err);
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: "Please try again later!",
  });
};

//GLOBAL ERROR HANDLING MIDDLEWARE
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (error.name === "CastError") {
      error = handleCastErrDB(error);
    }

    if (error.name === "JsonWebTokenError") {
      error = new AppError("Invalid token, please log in again!", 401);
    }

    if (error.name === "TokenExpiredError") {
      error = new AppError("Token has been expired, please log in again!", 401);
    }

    if (error.code === 11000) {
      error = handleDuplicateErrDB(error);
    }

    if (error._message === "Validation failed") {
      error = handleValidationErrDB(error);
    }

    sendErrProd(error, req, res);
  }
};
