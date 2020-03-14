const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const validator = require("validator");

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Invalid Email Address"]
  },
  wallet: {
    balanceUSD: { type: Number, trim: true, default: 10.0 },
    balanceBTC: { type: Number, trim: true, default: 0.0 },
    accountNo: Object,
    privateKey: Object
  },
  authCode: {
    type: String,
    trim: true
  },
  role: String,
  status: {
    type: String,
    trim: true,
    required: true
  },
  created_at: Date,
  updated_at: Date
});

// save middleware
userSchema.pre("save", function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;

  next();
});

// update middleware
userSchema.pre("update", function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;

  next();
});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model("User", userSchema);
