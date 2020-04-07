const mongoose = require("mongoose");
const mongodbErrorHandler = require("mongoose-mongodb-errors");

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const serviceSchema = new Schema({
  userid: { type: Schema.Types.ObjectId, required: true, trim: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  created_at: Date,
  updated_at: Date
});

// save middleware
serviceSchema.pre("save", function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;

  next();
});

// update middleware
serviceSchema.pre("update", function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;

  next();
});

serviceSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model("Services", serviceSchema);
