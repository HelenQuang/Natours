const express = require("express");
const {
  checkID,
  aliasTopTours,
  getAllTours,
  createNewTour,
  getSpecificTour,
  updateTour,
  deleteTour,
} = require("./../controllers/tourController");

const router = express.Router();

// router.param("id", checkID);
router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/").get(getAllTours).post(createNewTour);
router.route("/:id").get(getSpecificTour).patch(updateTour).delete(deleteTour);

module.exports = router;
