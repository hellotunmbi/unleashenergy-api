const express = require("express");
const router = express.Router();

// const userController = require("./user.controller");
const cylinderController = require("../controllers/cylinders.controller");

router.get("/", cylinderController.allCylinders);

router.get("/:id", cylinderController.cylinderDetails);

router.post("/", cylinderController.addCylinders);

module.exports = router;
