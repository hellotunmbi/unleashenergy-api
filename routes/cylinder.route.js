const express = require("express");
const router = express.Router();

// const userController = require("./user.controller");
const cylinderController = require("../controllers/cylinders.controller");

router.get("/", cylinderController.allCylinders);

module.exports = router;
