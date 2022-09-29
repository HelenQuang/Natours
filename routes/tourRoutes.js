const express = require("express");
const {
  checkID,
  checkBody,
  getAllTours,
  createNewTour,
  getSpecificTour,
  updateTour,
  deleteTour,
} = require("./../controllers/tourController");

const router = express.Router();

router.param("id", checkID);

router.route("/").get(getAllTours).post(checkBody, createNewTour);
router.route("/:id").get(getSpecificTour).patch(updateTour).delete(deleteTour);

module.exports = router;
