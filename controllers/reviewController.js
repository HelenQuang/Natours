const Review = require("../models/reviewModel");
// const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

//Get All Reviews
exports.getAllReviews = factory.getAll(Review);

//Get Specific Review
exports.getSpecificReview = factory.getSpecificOne(Review);

//Create New Review
exports.setTourAndUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.createNewReview = factory.createOne(Review);

//Delete Review
exports.deleteReview = factory.deleteOne(Review);

//Update Review
exports.updateReview = factory.updateOne(Review);
