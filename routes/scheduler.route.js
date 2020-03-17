const express = require("express");
const router = express.Router();

const schedulerCtrl = require("../controllers/scheduler.controller");

router.post("/", schedulerCtrl.runScheduler);

module.exports = router;
