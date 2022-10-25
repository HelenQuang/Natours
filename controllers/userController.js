const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

//ROUTE HANDLER

//Get All Users
exports.getAllUsers = factory.getAll(User);

//Get Specific User
exports.getSpecificUser = factory.getSpecificOne(User);

//Delete user
exports.deleteUser = factory.deleteOne(User);

//Update user
exports.updateUser = factory.updateOne(User);

//Create user
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Please use /signup instead",
  });
};

//Get User Data Middleware
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

//Update User Data
exports.updateMe = catchAsync(async (req, res, next) => {
  //1. Create error if user post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for updating password, please use /updateMyPassword instead",
        400
      )
    );
  }

  //2. Filter out unwanted fields that are not allow to update(role, passwordResetToken,...)
  const filteredBody = filterObj(req.body, "name", "email");

  //3. Update user data
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: { user: updatedUser },
  });
});

//Deactive user
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({ status: "success", data: null });
});
