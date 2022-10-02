const express = require("express");
const {
  checkID,
  getAllTours,
  createNewTour,
  getSpecificTour,
  updateTour,
  deleteTour,
} = require("./../controllers/tourController");

const router = express.Router();

// router.param("id", checkID);

router.route("/").get(getAllTours).post(createNewTour);
router.route("/:id").get(getSpecificTour).patch(updateTour).delete(deleteTour);

module.exports = router;
