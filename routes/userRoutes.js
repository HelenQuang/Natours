const express = require("express");
const {
  getAllUsers,
  updateMe,
  deleteMe,
  deleteUser,
} = require("./../controllers/userController");
const {
  signUp,
  logIn,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} = require("../controllers/authController");

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/signup").post(signUp);
router.route("/login").post(logIn);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").patch(resetPassword);
router.route("/updateMyPassword").patch(protect, updatePassword);
router.route("/updateMe").patch(protect, updateMe);
router.route("/deleteMe").delete(protect, deleteMe);
router.route("/:id").delete(deleteUser);

module.exports = router;
