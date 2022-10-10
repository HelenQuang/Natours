const express = require("express");
// const {
//   getAllUsers,
//   createNewUser,
//   getSpecificUser,
//   updateUser,
//   deleteUser,
// } = require("./../controllers/userController");
const { signUp } = require("../controllers/authController");

const router = express.Router();

router.route("/signup").post(signUp);

module.exports = router;
