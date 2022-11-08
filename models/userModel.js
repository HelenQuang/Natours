const crypto = require("crypto");
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
    default: "default.jpg",
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
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
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: { type: Boolean, default: true, select: false },
});

/////////////////////////////////////////////
//MIDDLEWARE to bcrypt password and remove passwordConfirm bf saving to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; //Remove it before saving to DB

  next();
});

//MIDDLEWARE to update passwordChangedAt property when password property is modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

//MIDDLEWARE to find only docs that active property is not equal to false
userSchema.pre(/^find/, async function (next) {
  this.find({ active: { $ne: false } });
  next();
});

//////////////////////////////////////
//INSTANCE METHOD: AVAILABLE ON ALL DOCS OF A CERTAIN COLLECTION

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

//Instance method to create new token when reset password
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //expires in 10mins

  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
