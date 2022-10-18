const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

///////////////////////////////////////////
// GLOBAL MIDDLEWARES: These middleware apply to all routes below
//To set security headers
app.use(helmet());

//To log development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//To limit the requests coming from 1 IP => block these requests
const limiter = rateLimit({
  max: 100, //number of max requests
  windowMs: 60 * 60 * 1000, //Milisecond time window (1hour)
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

//To read data from body into req.body
app.use(express.json({ limit: "10kb" }));

//To sanitize data against NoSQL query injection
app.use(mongoSanitize());

//To sanitize data against XSS attacks
app.use(xss());

//To prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      //Except for these parameters
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

//To test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

///////////////////////////////////////////
//ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  //use all for all methods(get, post, delete,...)

  next(new AppError(404, `${req.originalUrl} cannot find in this server`)); //pass anything into next => is assumed as an error & skip all other middlewares & send that error to the global handling error
});

app.use(globalErrorHandler);

module.exports = app;
