const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const orderSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  order_id: { type: String, required: true },
  address_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  cylinder_id: { type: Schema.Types.ObjectId, ref: "Cylinder" },
  paid: {
    type: Boolean,
  },
  payment_method: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    trim: true,
    required: true,
    enum: ["pending", "paid", "failed", "inactive"],
  },
  reference: String,
  transaction: String,
  trxref: String,
  created_at: { type: Date },
  updated_at: Date,
});

// save middleware
orderSchema.pre("save", function (next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;

  next();
});

// update middleware
orderSchema.pre("update", function (next) {
  // get the current date
  const currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;

  next();
});

module.exports = mongoose.model("Orders", orderSchema);
