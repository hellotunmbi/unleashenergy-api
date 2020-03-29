const jwt = require("jsonwebtoken");
const Settings = require("../models/Settings");
const History = require("../models/History");
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

// Save Investment...
exports.saveInvestment = async (req, res) => {
  const { userid, email, fullname } = req;

  const {
    amtInvested,
    daysRunning,
    currentBalance,
    dailyInterest,
    maturityPeriod,
    endDate,
    modeOfPayment,
    status,
    dateActivated
  } = req.body;

  let newInvestment = new Investment({
    userid,
    amtInvested,
    daysRunning,
    currentBalance,
    dailyInterest,
    maturityPeriod,
    endDate,
    modeOfPayment,
    status,
    dateActivated
  });

  // const account;
  // await Settings.find({name: 'mainsetting'}, function(err, settings) {
  //   account["bank"] = settings["bank"];
  //   account["bitcoin"] = settings["bitcoin"];
  // });

  newInvestment.save(function(err) {
    if (err) {
      res.json({
        status: 400,
        data: { message: "Unable to save transaction", error: err }
      });
    } else {
      const msg = {
        to: email,
        from: {
          email: "support@purpcoininvest.com",
          name: "Purple Coin Investment"
        },
        subject: "Activate Your Investement - PurpCoin Invest",
        text: "Activate Your Investement - PurpCoin Invest",
        html: `Dear ${fullname},<br/><br/>
    				We have received your request to invest ${amtInvested} in Purple Coin Investment.<br/><br/>
            Your investment will run for 90 days starting from the date your investment is activated:<br/><br/>
            Activation is done by making your payment to the following account and completing the process on the app or by replying to this email with details of your payment<br/><br/>
          `
      };
      sgMail.send(msg);

      res.json({
        status: 200,
        data: {
          message: "Transaction Successfully Saved"
        }
      });
    }
  });
};

// My investment
exports.getInvestment = async (req, res) => {
  const { userid } = req;

  try {
    const myInvestment = await Investment.find({ userid: userid });

    if (myInvestment.length === 0) {
      res.json({
        status: 200,
        data: { message: "You dont have any active investment" }
      });

      return;
    }

    res.json({
      status: 200,
      data: {
        mesage: "Investments Found",
        investments: myInvestment
      }
    });
  } catch (error) {
    res.json({
      status: 400,
      data: { message: "Unable to get your investments", error: error }
    });
  }
};
