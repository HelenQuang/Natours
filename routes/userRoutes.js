const express = require("express");
const { getAllUsers } = require("./../controllers/userController");
const { signUp, logIn } = require("../controllers/authController");

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/signup").post(signUp);
router.route("/login").post(logIn);

module.exports = router;
