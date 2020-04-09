const jwt = require("jsonwebtoken");
const History = require("../models/History");
const User = require("../models/User");
const Order = require("../models/Order");
const Services = require("../models/Services");
const asyncHandler = require("../middlewares/async.middleware");
const ErrorResponse = require("../utils/errorResponse");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ---------------------------------------------------------
//Get User Transaction...

exports.history = asyncHandler(async (req, res, next) => {
  const { userid, email } = req;
  const history = await History.find({ userid });

  if (history.length === 0) {
    res.json({
      status: 200,
      data: {
        message: "No transaction found"
      }
    });
  } else if (history.length > 0) {
    res.json({
      status: 200,
      data: {
        message: "Transactions Found",
        transactions: history
      }
    });
  }
});

// ---------------------------------------------------------
//Save Transaction...

exports.saveHistory = (req, res) => {
  const { userid, email } = req;
  const { description, amountUSD, transactionDate } = req.body;

  // res.json({
  //   status: 200,
  //   userid: userid,
  //   email: email
  // });
  // return;

  let history = new History({
    userid,
    email,
    description,
    amountUSD,
    transactionDate
  });

  history.save(function(err) {
    if (err) {
      res.json({
        status: 400,
        data: { message: "Unable to save transaction", error: err }
      });
    } else {
      res.json({
        status: 200,
        data: {
          message: "Transaction Successfully Saved"
        }
      });
    }
  });
};

// ---------------------------------------------------------
// Add Address...

exports.addAddress = asyncHandler(async (req, res, next) => {
  const { address, city, localgovt } = req.body;
  const { id, phone } = req;

  if (!address || !city || !localgovt || !id || !phone) {
    return next(
      new ErrorResponse(
        "Expecting address,city and localgovt but got incomplete data",
        400
      )
    );
  }

  const newAddess = {
    address,
    city,
    localgovt
  };

  const addressAdded = await User.findOneAndUpdate(
    { _id: id, phone },
    { $push: { addresses: newAddess } }
  );

  res.json({
    status: 200,
    data: {
      message: "Address added successfully"
    }
  });
});

// ---------------------------------------------------------
// Get User Address...

exports.getUserAddress = asyncHandler(async (req, res, next) => {
  const id = req.id;

  const userAddress = await User.findById(id).select("addresses");

  if (userAddress && userAddress["addresses"].length > 0) {
    res.json({
      status: 200,
      data: {
        message: "Addresses successfully found!",
        addresses: userAddress.addresses
      }
    });
  } else {
    res.json({
      status: 200,
      data: {
        message: "No address found"
      }
    });
  }
});

// ---------------------------------------------------------
// Create New Order...

exports.orderGasRefill = asyncHandler(async (req, res) => {
  const id = req.id;
  const { address_id, cylinder_size, payment_method, status } = req.body;
  const paid = false;

  if (!cylinder_size || !payment_method || !status || !id) {
    res.json({
      status: 400,
      data: {
        message: "Incomplete parameters"
      }
    });
    return;
  }

  const gasRequested = await Order.create({
    user_id: id,
    address_id,
    cylinder_size,
    payment_method,
    status,
    paid
  });

  if (gasRequested) {
    res.json({
      status: 200,
      data: {
        message: "Gas Refill Requested Successfully",
        gasrefill: gasRequested
      }
    });
  } else {
    res.json({
      status: 400,
      data: {
        message: "Unable to submit gas refill request"
      }
    });
  }
});

// ---------------------------------------------------------

// Service Request...
exports.requestService = asyncHandler(async (req, res) => {
  const { category, description, status } = req.body;
  const id = req.id;

  if (!id || !category || !description || !status) {
    res.json({
      status: 400,
      data: {
        message: "Parameters not set or complete"
      }
    });
    return;
  }

  const service = {
    userid: id,
    category,
    description,
    status
  };

  const serviceAdded = await Services.create(service);

  res.json({
    status: 200,
    data: {
      message: "Service Requested Successfully",
      services: serviceAdded
    }
  });
});
