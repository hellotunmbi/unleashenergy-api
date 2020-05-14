const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const productSchema = new Schema({
  imageURL: { type: String },
  title: {
    type: String,
    required: true,
  },
  price: { type: Number, required: true },
  description: {
    type: String,
  },
  category: {
    type: [{ type: String }],
  },
  quantity: { type: Number },
  created_at: { type: Date },
  updated_at: Date,
});

// save middleware
productSchema.pre("save", function (next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;

  next();
});

// update middleware
productSchema.pre("update", function (next) {
  // get the current date
  const currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;

  next();
});

module.exports = mongoose.model("Products", productSchema);
