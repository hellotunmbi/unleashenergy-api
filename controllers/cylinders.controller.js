const Settings = require("../models/Settings");
const Cylinders = require("../models/Cylinders");
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
        cylinders
      }
    });
  }
});

exports.updateCylinder = asyncHandler(async (req, res, next) => {
  const cylinders = await Cylinders.find({});

  if (cylinders.length === 0) {
    return next(new ErrorResponse("No cylinder found", 400));
  } else if (cylinders.length > 0) {
    res.json({
      status: 200,
      data: {
        message: "Cylinders Found",
        cylinders
      }
    });
  }
});

exports.addCylinders = asyncHandler(async (req, res, next) => {
  const cylinders = await Cylinders.find({});

  if (cylinders.length === 0) {
    return next(new ErrorResponse("No cylinder found", 400));
  } else if (cylinders.length > 0) {
    res.json({
      status: 200,
      data: {
        message: "Cylinders Found",
        cylinders
      }
    });
  }
});
