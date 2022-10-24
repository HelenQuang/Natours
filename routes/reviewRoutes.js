const express = require("express");
const {
  getAllReviews,
  getSpecificReview,
  createNewReview,
  deleteReview,
  updateReview,
  setTourAndUserId,
} = require("../controllers/reviewController");

const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router({ mergeParams: true }); //MergeParam to access params in other routers(tourRoutes)

router
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user"), setTourAndUserId, createNewReview);
router
  .route("/:id")
  .get(getSpecificReview)
  .delete(deleteReview)
  .patch(updateReview);

module.exports = router;
