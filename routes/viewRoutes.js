const express = require("express");
const {
  getOverview,
  getTour,
  getLoginForm,
  getSignupForm,
  getAccount,
} = require("../controllers/viewController");
const { protect, isLoggedIn } = require("../controllers/authController");

const router = express.Router();

router.get("/", isLoggedIn, getOverview);
router.get("/tour/:slug", isLoggedIn, getTour);
router.get("/login", isLoggedIn, getLoginForm);
router.get("/signup", isLoggedIn, getSignupForm);
router.get("/me", protect, getAccount);

module.exports = router;
