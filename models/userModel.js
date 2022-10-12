const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

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
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      //This validator only works when CREATE or SAVE not UPDATE
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords do not match",
    },
  },
  passwordChangedAt: Date,
});

//bcrypt password and remove passwordConfirm bf saving to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined; //Remove it before saving to DB
  next();
});

//Instance method: available on all documents of a certain collection
//Instance method to check if the input password when log in is the same as the password in database
userSchema.methods.comparePassword = async function (
  inputPassword,
  databasePassword
) {
  return await bcrypt.compare(inputPassword, databasePassword);
};

//Instance method to check if user has recently change password
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp; //return TRUE when the time that JWT issued < the time that change password
  }
  return false; //return FALSE when there is no change
};

const User = mongoose.model("User", userSchema);
module.exports = User;
