const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");
const adminUserController = require("../../controllers/admin/user.controller");
const productsController = require("../../controllers/products.controller");

router.get("/users", adminUserController.allUsers);

router.get("/orders", adminUserController.allOrders);

router.get("/services", adminUserController.allServices);

router.get("/payments", adminUserController.allPayments);

router.post("/", adminUserController.updateUser);

// History
router.post("/transactions/:id/:phone", adminUserController.history);

// Products - Marketplace
router.get("/product", productsController.allProducts); //TODO: Add Admin Middleware

router.get("/product/:id", productsController.productDetails); //TODO: Add Admin Middleware

router.post("/product", productsController.addProduct); //TODO: Add Admin Middleware

router.delete("/product/:id", productsController.removeProduct); //TODO: Add Admin Middleware

router.patch("/product", productsController.updateProduct); //TODO: Add Admin Middleware

module.exports = router;
