const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

router.get("/", (req, res) => {
  res.send("User");
});

router.post("/login", authController.login);
router.post("/register", authController.register);

module.exports = router;