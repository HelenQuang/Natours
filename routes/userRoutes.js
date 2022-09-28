const express = require("express");
const {
  getAllUsers,
  createNewUser,
  getSpecificUser,
  updateUser,
  deleteUser,
} = require("./../controllers/userController");

const router = express.Router();

router.route("/").get(getAllUsers).post(createNewUser);
router.route("/:id").get(getSpecificUser).patch(updateUser).delete(deleteUser);

module.exports = router;
