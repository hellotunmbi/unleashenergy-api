const express = require("express");
const router = express.Router();

const productsController = require("../controllers/products.controller");

router.get("/", productsController.allProducts);

// get single product
router.get("/:id", productsController.productDetails);

// router.get("/category/:category", productsController.productsByCategory);

router.patch("/:id", productsController.updateProduct);

router.post("/", productsController.addProduct);

router.delete("/:id", productsController.removeProduct);

module.exports = router;
