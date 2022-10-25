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
router.use(protect);

router
  .route("/")
  .get(getAllReviews)
  .post(restrictTo("user"), setTourAndUserId, createNewReview);
router
  .route("/:id")
  .get(getSpecificReview)
  .patch(restrictTo("user", "admin"), updateReview)
  .delete(restrictTo("user", "admin"), deleteReview);

module.exports = router;
