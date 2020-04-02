const jwt = require("jsonwebtoken");
const Settings = require("../models/Settings");
const History = require("../models/History");
const User = require("../models/User");
const Investment = require("../models/Investment");
const asyncHandler = require("../middlewares/async.middleware");
const ErrorResponse = require("../utils/errorResponse");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

// Add Address
exports.addAddress = asyncHandler(async (req, res, next) => {
  const { address, city, localgovt } = req.body;
  const { id, phone } = req;

  if (!address || !city || !localgovt || !id || !phone) {
    res.json({
      status: 400,
      data: {
        message: "Expecting address,city and localgovt but got incomplete data"
      }
    });
    return;
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
