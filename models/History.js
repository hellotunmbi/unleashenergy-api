const mongoose = require("mongoose");
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const validator = require("validator");

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const historySchema = new Schema({
  userid: { type: String, required: true, trim: true },
  phone: {
    type: String,
    trim: true,
    required: true,
  },
  description: { type: String, required: true },
  amount: {
    type: Number,
    required: true,
  },
  transactionDate: { type: Date, required: true, default: Date.now },
  created_at: Date,
  updated_at: Date,
});

// save middleware
historySchema.pre("save", function (next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;

  next();
});

// update middleware
historySchema.pre("update", function (next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;

  next();
});

historySchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model("History", historySchema);
