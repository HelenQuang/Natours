const fs = require("fs");

//GET FILE
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

//ROUTE HANDLER
//Get All Users
exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: users.length,
    data: { users },
  });
};

//Create New User
exports.createNewUser = (req, res) => {
  res
    .status(500)
    .json({ status: "error", message: "This route is not defined" });
};

//Get Specific User
exports.getSpecificUser = (req, res) => {
  res
    .status(500)
    .json({ status: "error", message: "This route is not defined" });
};

//Update User
exports.updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: "error", message: "This route is not defined" });
};

//Delete User
exports.deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: "error", message: "This route is not defined" });
};
