const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide us your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide us a valid email"],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please provide us your password"],
    minLength: 8,
  },
  passwordConfirm: {
    type: Number,
    required: [true, "Please confirm your password"],
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
