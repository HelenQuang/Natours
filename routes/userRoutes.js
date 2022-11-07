const express = require("express");

const {
  getAllUsers,
  getSpecificUser,
  deleteUser,
  updateUser,
  createUser,
  getMe,
  updateMe,
  deleteMe,
  uploadUserPhoto,
} = require("./../controllers/userController");
const {
  signUp,
  logIn,
  logOut,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
} = require("../controllers/authController");

const router = express.Router();

router.route("/signup").post(signUp);
router.route("/login").post(logIn);
router.route("/logout").get(logOut);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").patch(resetPassword);

router.use(protect); //All routers after this point will be protected

router.route("/updateMyPassword").patch(updatePassword);
router.route("/me").get(getMe, getSpecificUser);
router.route("/updateMe").patch(uploadUserPhoto, updateMe);
router.route("/deleteMe").delete(deleteMe);

router.use(restrictTo("admin")); //All routers after this point will be restricted to admin
router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getSpecificUser).delete(deleteUser).patch(updateUser);

module.exports = router;
