const mongoose = require("mongoose");

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const cylinderSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  imageURL: String,
  quantity: { type: String },
  dimension: {
    height: String,
    width: String
  },
  price: {
    type: Number
  },
  created_at: { type: Date },
  updated_at: Date
});

// save middleware
cylinderSchema.pre("save", function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;

  next();
});

// update middleware
cylinderSchema.pre("update", function(next) {
  // get the current date
  const currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;

  next();
});

module.exports = mongoose.model("Cylinder", cylinderSchema);
