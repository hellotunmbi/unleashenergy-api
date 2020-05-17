const express = require("express");
const router = express.Router();

const productsController = require("../controllers/products.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", productsController.allProducts);

router.get("/purchase", productsController.allPurchases);

// get single product
router.get("/:id", productsController.productDetails);

// router.get("/category/:category", productsController.productsByCategory);

router.patch("/:id", productsController.updateProduct); //TODO: Add Admin Middleware

router.post("/", productsController.addProduct); //TODO: Add Admin Middleware

router.delete("/:id", productsController.removeProduct); //TODO: Add Admin Middleware

router.post(
  "/purchase",
  authMiddleware.verifyToken,
  productsController.purchaseProduct
);

module.exports = router;
