const Settings = require("../models/Settings");
const Cylinders = require("../models/Cylinder");
const asyncHandler = require("../middlewares/async.middleware");
const ErrorResponse = require("../utils/errorResponse");

exports.allCylinders = asyncHandler(async (req, res, next) => {
  const cylinders = await Cylinders.find({});

  if (cylinders.length === 0) {
    return next(new ErrorResponse("No cylinder found", 400));
  } else if (cylinders.length > 0) {
    res.json({
      status: 200,
      data: {
        message: "Cylinders Found",
        cylinders,
      },
    });
  }
});

// ---------------------------------------------------------

exports.updateCylinder = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const cylinder = await Cylinders.findByIdAndUpdate(
    id,
    { $set: req.body.cylinder },
    { new: true }
  );

  if (!cylinder) {
    return next(new ErrorResponse("No cylinder updated", 400));
  } else {
    res.json({
      status: 200,
      data: {
        message: "Cylinder updated successfully",
        cylinder,
      },
    });
  }
});

// ---------------------------------------------------------

exports.addCylinders = asyncHandler(async (req, res, next) => {
  const { name, quantity, dimension, price, imageURL } = req.body;

  if (!name || !quantity || !price || !imageURL) {
    return next(new ErrorResponse("Some parameters are still needed"));
  }

  const cylinders = await Cylinders.create({
    name,
    quantity,
    imageURL,
    dimension,
    price,
  });

  if (!cylinders) {
    return next(new ErrorResponse("No cylinder found", 400));
  }
  res.json({
    status: 200,
    data: {
      message: "New Cylinder Added",
      cylinders,
    },
  });
});

// ---------------------------------------------------------

exports.cylinderDetails = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return next(new ErrorResponse("id not defined", 400));
  }

  const cylinder = await Cylinders.findById(id);

  res.json({
    status: 200,
    data: {
      message: "Cylinder details retrieved",
      cylinder,
    },
  });
});

// ---------------------------------------------------------

exports.deleteCylinder = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const deleted = await Cylinders.findByIdAndDelete(id);

  if (!deleted) {
    return next(new ErrorResponse("Unable to delete cylinder", 400));
  } else {
    res.json({
      status: 200,
      data: {
        message: "Cylinder Deleted",
      },
    });
  }
});
