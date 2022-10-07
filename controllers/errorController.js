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
  if (res.isOperational) {
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
    sendErrProd(err, res);
  }
};
