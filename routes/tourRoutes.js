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

const { protect } = require("../controllers/authController");

const router = express.Router();

// router.param("id", checkID);
router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router.route("/").get(protect, getAllTours).post(createNewTour);
router.route("/:id").get(getSpecificTour).patch(updateTour).delete(deleteTour);

module.exports = router;
