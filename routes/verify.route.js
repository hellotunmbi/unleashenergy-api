const express = require("express");
const router = express.Router();

const verifyController = require("../controllers/verify.controller");

// CONFIRM USER ACCOUNT...
router.get("/:id", verifyController.confirmUserAccount);

module.exports = router;
