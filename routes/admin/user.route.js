const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");
const adminUserController = require("../../controllers/admin/user.controller");

router.get("/", adminUserController.allUsers);

router.post("/", adminUserController.updateUser);

// History
router.post("/transactions/:id/:phone", adminUserController.history);

module.exports = router;
