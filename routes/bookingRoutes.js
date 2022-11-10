const express = require("express");
const {
  getCheckoutSession,
  getAllBookings,
  getSpecificBooking,
  createBooking,
  updateBooking,
  deleteBooking,
} = require("./../controllers/bookingController");
const { protect, restrictTo } = require("./../controllers/authController");

const router = express.Router();

router.use(protect);

router.get("/checkout-session/:tourId", getCheckoutSession);

router.use(restrictTo("admin", "lead-guide"));

router.route("/").get(getAllBookings).post(createBooking);

router
  .route("/:id")
  .get(getSpecificBooking)
  .patch(updateBooking)
  .delete(deleteBooking);

module.exports = router;
