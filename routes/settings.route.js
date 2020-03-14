const express = require("express");
const router = express.Router();

const settingsController = require("../controllers/settings.controller");

router.get("/", (req, res) => {
  res.send("Settings");
});

// router.post("/updatebank", settingsController);

router.post("/plans", settingsController.addPlan);
router.get("/plans", settingsController.allPlans);

router.get("/bankdetails", settingsController.getBankDetails);
router.post("/bankdetails", settingsController.updateBankDetails);

router.get("/bitcoin", settingsController.getBitcoin);
router.post("/bitcoin", settingsController.updateBitcoin);

module.exports = router;
