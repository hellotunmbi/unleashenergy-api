const mongoose = require("mongoose");
const mongodbErrorHandler = require("mongoose-mongodb-errors");

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const investmentSchema = new Schema({
  userid: { type: Schema.Types.ObjectId, required: true, trim: true },
  amtInvested: { type: Number, required: true },
  daysRunning: { type: Number, required: true },
  currentBalance: { type: Number, required: true },
  dailyInterest: { type: Number, required: true },
  maturityPeriod: Number,
  endDate: { type: Date, required: true },
  modeOfPayment: String,
  status: { type: String, required: true },
  dateInvested: Date,
  created_at: Date,
  updated_at: Date
});

// save middleware
investmentSchema.pre("save", function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;

  next();
});

// update middleware
investmentSchema.pre("update", function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;

  next();
});

investmentSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model("Investment", investmentSchema);
