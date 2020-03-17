const Settings = require("../models/Settings");

const settingsKey = "mainsetting";

exports.getBankDetails = (req, res) => {
  Settings.findOne({ name: settingsKey }, function(err, bankDetails) {
    if (err) {
      res.json({
        status: 400,
        data: { message: "Unable to create plan" }
      });
    } else {
      res.json({
        status: 200,
        data: {
          message: "Bank Details Found",
          bankDetails: bankDetails["bank"],
          adminEmail: bitcoinDetails.adminEmail
        }
      });
    }
  });
};

//Update Bank Account details...
exports.updateBankDetails = (req, res) => {
  const {
    bankName,
    acctName,
    acctNumber,
    address,
    iBank,
    bankAddress,
    swiftCode,
    sortCode
  } = req.body;

  let newBankDetails = {
    bankName,
    acctName,
    acctNumber,
    address,
    iBank,
    bankAddress,
    swiftCode,
    sortCode
  };

  Settings.findOneAndUpdate(
    { name: settingsKey },
    { bank: newBankDetails },
    function(err, updatedBank) {
      if (err) {
        res.json({
          status: 400,
          data: { message: "Unable to update bank" }
        });
      } else if (updatedBank) {
        res.json({
          status: 200,
          data: {
            message: "Bank Details Updated Successfully"
          }
        });
      }
    }
  );
};

// ===============================

exports.getBitcoin = (req, res) => {
  Settings.findOne({ name: settingsKey }, function(err, bitcoinDetails) {
    if (err) {
      res.json({
        status: 400,
        data: { message: "Unable to update bitcoin" }
      });
    } else {
      res.json({
        status: 200,
        data: {
          message: "Bitcoin Details Found",
          bitcoinDetails: bitcoinDetails["bitcoin"],
          adminEmail: bitcoinDetails.adminEmail
        }
      });
    }
  });
};

//Update Bitcoin details...
exports.updateBitcoin = (req, res) => {
  if (!req.body.btcAddress) {
    res.json({ status: 400, data: { message: "btcAddress body required" } });
    return;
  }
  const btcAddress = req.body.btcAddress;
  let newBitcoin = { btcAddress };
  Settings.findOneAndUpdate(
    { name: settingsKey },
    { bitcoin: newBitcoin },
    function(err, bitcoinUpdated) {
      if (err) {
        res.json({
          status: 400,
          data: { message: "Unable to update bitcoin details" }
        });
      } else if (bitcoinUpdated) {
        res.json({
          status: 200,
          data: {
            message: "Bitcoin Details Updated Successfully"
          }
        });
      }
    }
  );
};

// ===============================

exports.addPlan = (req, res) => {
  const { investAmount, profit, duration } = req.body;

  let newPlan = { investAmount, profit, duration };

  Settings.findOneAndUpdate(
    { name: settingsKey },
    { $push: { plans: newPlan } },
    function(err, planUpdated) {
      if (err) {
        res.json({
          status: 400,
          data: { message: "Unable to create plan" }
        });
      } else if (planUpdated) {
        res.json({
          status: 200,
          data: {
            message: "Plan Saved Successfully"
          }
        });
      }
    }
  );
};

//Get all plans..
exports.allPlans = (req, res) => {
  Settings.findOne({ name: settingsKey }, function(err, plans) {
    if (err) {
      res.json({ status: 400, data: { message: "Unable to find plans" } });
    } else if (plans) {
      res.json({
        status: 200,
        data: {
          message: "Plans Found",
          plans: plans["plans"]
        }
      });
    }
  });
};

exports.updatePlan = (req, res) => {};
