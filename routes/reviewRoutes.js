const express = require("express");
const {
  getAllReviews,
  createNewReview,
} = require("../controllers/reviewController");

const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user"), createNewReview);

module.exports = router;
