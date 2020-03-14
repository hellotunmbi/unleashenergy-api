const express = require("express");
const router = express.Router();

// const userController = require("./user.controller");
const authController = require("../controllers/auth.controller");

router.get("/", (req, res) => {
  res.send("Auth");
});

router.post("/login", authController.login);
router.post("/register", authController.register);

// router.post("/sendemail", authController.sendEmail);

module.exports = router;
