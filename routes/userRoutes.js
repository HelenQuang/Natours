const express = require("express");
// const {
//   getAllUsers,
//   createNewUser,
//   getSpecificUser,
//   updateUser,
//   deleteUser,
// } = require("./../controllers/userController");
const { signUp, logIn } = require("../controllers/authController");

const router = express.Router();

router.route("/signup").post(signUp);
router.route("/login").post(logIn);

module.exports = router;
