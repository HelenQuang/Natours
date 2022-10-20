const express = require("express");
const {
  getAllReviews,
  createNewReview,
} = require("../controllers/reviewController");

const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router({ mergeParams: true }); //MergeParam to access params in other routers(tourRoutes)

router
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user"), createNewReview);

module.exports = router;
