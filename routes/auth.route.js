const express = require("express");
const router = express.Router();

// const userController = require("./user.controller");
const authController = require("../controllers/auth.controller");

router.get("/", (req, res) => {
  res.send("Auth");
});

router.post("/login", authController.login);
router.post("/verifyotp", authController.verifyOTP);
router.post("/register", authController.register);

router.post("/resendOTP", authController.resendOTP);
router.post("/sendemail", authController.sendEmail);

module.exports = router;
