const jwt = require("jsonwebtoken");
const User = require("../models/User");
const History = require("../models/History");
const Investment = require("../models/Investment");

//Get User Transaction...
exports.history = (req, res) => {
  const { userid, email } = req;

  History.find({ userid }, function(err, history) {
    if (err) {
      res.json({
        status: 200,
        data: { message: "Unable to retrieve transaction history" }
      });
    }

    if (history.length === 0) {
      res.json({
        status: 400,
        data: {
          message: "No transaction found"
        }
      });
    } else if (history.length > 0) {
      res.json({
        status: 200,
        data: {
          message: "Transactions Found",
          transations: history
        }
      });
    }
  });
};

//Save Transaction...
exports.saveHistory = (req, res) => {
  const { userid, email } = req;
  const { description, amountUSD, transactionDate } = req.body;

  let history = new History({
    userid: id,
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
exports.saveInvestment = (req, res) => {
  const userid = req.userid;

  const {
    amtInvested,
    daysRunning,
    currentBalance,
    dailyInterest,
    maturityPeriod,
    endDate,
    modeOfPayment,
    status,
    dateInvested
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
    dateInvested
  });

  newInvestment.save(function(err) {
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

// My investment
exports.getInvestment = async (req, res) => {
  const { userid } = req;

  try {
    const myInvestment = await Investment.find({ userid: userid });

    if (myInvestment.length === 0) {
      res.json({
        status: 400,
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
