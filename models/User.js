const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const validator = require("validator");

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    validate: [validator.isEmail, "Invalid Email Address"],
  },
  phone: {
    type: String,
  },
  addresses: [{ address: String, city: String, localgovt: String }],
  authCode: {
    type: String,
    trim: true,
  },
  role: String,
  status: {
    type: String,
    trim: true,
    required: true,
    default: "pending",
    enum: ["pending", "incomplete", "active", "inactive"],
  },
  otp_expiry: { type: Date, default: new Date() },
  created_at: { type: Date },
  updated_at: Date,
});

// save middleware
userSchema.pre("save", function (next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;

  next();
});

// update middleware
userSchema.pre("update", function (next) {
  // get the current date
  const currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;

  next();
});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
// userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model("User", userSchema);
