const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", (req, res) => {
  res.send("User");
});

router.post(
  "/addaddress",
  authMiddleware.verifyToken,
  userController.addAddress
);

router.get(
  "/address",
  authMiddleware.verifyToken,
  userController.getUserAddress
);

router.post(
  "/requestservice",
  authMiddleware.verifyToken,
  userController.requestService
);

router.post(
  "/gasrefill",
  authMiddleware.verifyToken,
  userController.orderGasRefill
);

//get history of user's transactions
router.get("/history", authMiddleware.verifyToken, userController.history);

//save to history
router.post("/history", authMiddleware.verifyToken, userController.saveHistory);

//ger user's investments...

//save user's investment...
// router.post(
//   "/investment",
//   authMiddleware.verifyToken,
//   userController.saveInvestment
// );

// router.get(
//   "/investment",
//   authMiddleware.verifyToken,
//   userController.getInvestment
// );

module.exports = router;
