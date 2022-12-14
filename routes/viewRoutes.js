const express = require("express");
const {
  getOverview,
  getTour,
  getLoginForm,
  getSignupForm,
  getAccount,
  getMyTours,
} = require("../controllers/viewController");
const { protect, isLoggedIn } = require("../controllers/authController");
const { createBookingCheckout } = require("../controllers/bookingController");

const router = express.Router();

router.get("/", isLoggedIn, getOverview);
router.get("/tour/:slug", isLoggedIn, getTour);
router.get("/login", isLoggedIn, getLoginForm);
router.get("/signup", isLoggedIn, getSignupForm);
router.get("/me", protect, getAccount);
router.get("/my-tours", createBookingCheckout, protect, getMyTours);

module.exports = router;
