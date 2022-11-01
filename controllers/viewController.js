const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res, next) => {
  //1. Get all tour data from collection
  const tours = await Tour.find();

  //2. Build template
  //3. Render template
  res.status(200).render("overview", { title: "All Tours", tours });
});

exports.getTour = catchAsync(async (req, res) => {
  //1. Get requested tour data
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  //2. Build template
  //3. Render template
  res.status(200).render("tour", { title: `${tour.name} tour`, tour });
});

exports.getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render("login", {
    title: "Log into your account",
  });
});

exports.getSignupForm = catchAsync(async (req, res) => {
  res.status(200).render("signup", {
    title: "Sign up to new account",
  });
});
