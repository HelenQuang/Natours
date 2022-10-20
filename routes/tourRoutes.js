const express = require("express");
const {
  checkID,
  aliasTopTours,
  getAllTours,
  createNewTour,
  getSpecificTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
} = require("./../controllers/tourController");
const { protect, restrictTo } = require("../controllers/authController");

const reviewRouter = require("../routes/reviewRoutes");

const router = express.Router();

// router.param("id", checkID);
router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router.route("/").get(protect, getAllTours).post(createNewTour);
router
  .route("/:id")
  .get(getSpecificTour)
  .patch(updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

////////NESTED ROUTES
// router
//   .route("/:tourId/reviews")
//   .post(protect, restrictTo("user"), createNewReview);
router.use("/:tourId/reviews", reviewRouter);

module.exports = router;
