const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const purchaseSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
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
  payment_method: {
    type: String,
    required: true,
  },
  phone: { type: Number },
  status: {
    type: String,
    trim: true,
    required: true,
    enum: ["pending", "paid", "failed", "inactive"],
  },
  paid: {
    type: Boolean,
  },
  transaction: String,
  trxref: String,
  reference: String,
  created_at: { type: Date },
  updated_at: Date,
});

// save middleware
purchaseSchema.pre("save", function (next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;

  next();
});

// update middleware
purchaseSchema.pre("update", function (next) {
  // get the current date
  const currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;

  next();
});

module.exports = mongoose.model("Purchases", purchaseSchema);
