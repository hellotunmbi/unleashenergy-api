const mongoose = require("mongoose");
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const validator = require("validator");

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const settingsSchema = new Schema({
  bank: {
    bankName: String,
    acctName: String,
    acctNumber: String,
    address: String,
    iBan: String,
    bankAddress: String,
    swiftCode: String,
    sortCode: String
  },
  bitcoin: {
    btcAddress: { type: String }
  },
  plans: [
      { investAmount: String, profit: String, duration: Number }
  ],
  created_at: Date,
  updated_at: Date
});

// save middleware
settingsSchema.pre("save", function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;

  next();
});

// update middleware
settingsSchema.pre("update", function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;

  next();
});

settingsSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model("Settings", settingsSchema);
