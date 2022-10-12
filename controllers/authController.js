const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: { user: newUser },
  });
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1. Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  //2. Check if user exist and password is correct
  const user = await User.findOne({ email }).select("+password"); //Have to select back the password to compare bc we deselect password in the model

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(
      new AppError("Incorrect email or password. Please try again", 401)
    );
  }

  //3. If everything ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({ status: "success", token });
});

//Protect middleware fn to add to protect routes
exports.protect = catchAsync(async (req, res, next) => {
  //1. Get token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError(
        "You are not logged in. Please log in to get access to this page",
        401
      )
    );
  }

  //2. Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The token belongs to this user has no access", 401)
    );
  }

  //4. Check if user changed password after JWT was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "User has recently changed password. Please log in again.",
        401
      )
    );
  }

  //5. Grant access to protected route
  req.user = currentUser;
  next();
});
