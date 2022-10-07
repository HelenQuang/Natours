const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// MIDDLEWARES: These middleware apply to all routes below
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  //use all for all methods(get, post, delete,...)

  next(new AppError(404, `${req.originalUrl} cannot find in this server`)); //pass anything into next => is assumed as an error & skip all other middlewares & send that error to the global handling error
});

app.use(globalErrorHandler);

module.exports = app;
