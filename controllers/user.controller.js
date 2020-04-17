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
  const { id, phone } = req;
  const history = await History.find({ user_id: id, phone }).sort({
    created_at: -1,
  });

  if (history.length === 0) {
    res.json({
      status: 200,
      data: {
        message: "No transaction found",
      },
    });
  } else if (history.length > 0) {
    res.json({
      status: 200,
      data: {
        message: "Transactions Found",
        transactions: history,
      },
    });
  }
});

// ---------------------------------------------------------
//Save Transaction...

exports.saveHistory = (req, res) => {
  const { id, phone } = req;
  const { description, amount, transactionDate, status } = req.body;

  // res.json({
  //   status: 200,
  //   userid: userid,
  //   email: email
  // });
  // return;

  let history = new History({
    userid: id,
    phone,
    description,
    amount,
    transactionDate,
    status,
  });

  history.save(function (err) {
    if (err) {
      res.json({
        status: 400,
        data: { message: "Unable to save transaction", error: err },
      });
    } else {
      res.json({
        status: 200,
        data: {
          message: "Transaction Successfully Saved",
          user: {
            userid: id,
            phone,
          },
        },
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
    localgovt,
  };

  const addressAdded = await User.findOneAndUpdate(
    { _id: id, phone },
    { $push: { addresses: newAddess } }
  );

  res.json({
    status: 200,
    data: {
      message: "Address added successfully",
    },
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
        addresses: userAddress.addresses,
      },
    });
  } else {
    res.json({
      status: 200,
      data: {
        message: "No address found",
      },
    });
  }
});

// ---------------------------------------------------------
// Create New Order...

exports.orderGasRefill = asyncHandler(async (req, res) => {
  const user_id = req.id;
  const {
    address_id,
    cylinder_id,
    payment_method,
    amount,
    phone,
    description,
    status,
  } = req.body;

  if (!address_id || !cylinder_id || !payment_method || !status || !user_id) {
    res.json({
      status: 400,
      data: {
        message: "Incomplete parameters",
      },
    });
    return;
  }

  const gasRequested = await Order.create(Object.assign(req.body, { user_id }));

  const saveToHistory = await History.create({
    user_id,
    phone,
    description,
    amount,
    transactionDate: Date.now(),
    status,
  });

  if (gasRequested) {
    res.json({
      status: 200,
      data: {
        message: "Gas Refill Requested Successfully",
        gasrefill: gasRequested,
      },
    });
  } else {
    res.json({
      status: 400,
      data: {
        message: "Error in submitting gas refill request",
      },
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
        message: "Parameters not set or complete",
      },
    });
    return;
  }

  const service = {
    userid: id,
    category,
    description,
    status,
  };

  const serviceAdded = await Services.create(service);

  res.json({
    status: 200,
    data: {
      message: "Service Requested Successfully",
      services: serviceAdded,
    },
  });
});

// ---------------------------------------------------------
// Get User Profile...

exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  const id = req.id;
  const { fullname, email } = req.body;

  if (!fullname || !email) {
    res.json({
      status: 400,
      data: {
        message: "Incomplete body params",
      },
    });
    return;
  }

  const userData = await User.findByIdAndUpdate(
    id,
    { fullname, email },
    { new: true }
  ).select("_id fullname email, phone");

  // Sign token...
  const token = jwt.sign(
    {
      id: userData._id,
      phone,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1y" }
  );

  if (userData) {
    res.json({
      status: 200,
      data: {
        message: "User Information Updated Successfully!",
        user: userData,
        token,
      },
    });
  } else {
    res.json({
      status: 200,
      data: {
        message: "Unable to update user info",
      },
    });
  }
});
