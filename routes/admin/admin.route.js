const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

const authMiddleware = require("../../middlewares/auth.middleware");
const adminUserController = require("../../controllers/admin/user.controller");
const productsController = require("../../controllers/products.controller");
const cylinderController = require("../../controllers/cylinders.controller");

// Configure Cloudinary storage...
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const destUploadDir = (destination) =>
//   destination === "marketplace"
//     ? "mobileapp/marketplace"
//     : "mobileapp/cylinders";

const storage = cloudinaryStorage({
  cloudinary,
  folder: "mobileapp/marketplace",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit", blur: 300 }],
});
const uploadParser = multer({ storage });
// ----------
const cylinderStorage = cloudinaryStorage({
  cloudinary,
  folder: "mobileapp/cylinder",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit", blur: 300 }],
});
const cylinderUploadParser = multer({ storage: cylinderStorage });

// ================

router.get("/users", adminUserController.allUsers);

router.get("/orders", adminUserController.allOrders);

router.get("/services", adminUserController.allServices);

router.get("/payments", adminUserController.allPayments);

router.post("/", adminUserController.updateUser);

// History
router.post("/transactions/:id/:phone", adminUserController.history);

// ===============================
// Products - Marketplace
router.get("/product", productsController.allProducts); //TODO: Add Admin Middleware

router.get("/product/:id", productsController.productDetails); //TODO: Add Admin Middleware

router.post("/product", productsController.addProduct); //TODO: Add Admin Middleware

router.delete("/product/:id", productsController.removeProduct); //TODO: Add Admin Middleware

router.patch("/product/:id", productsController.updateProduct); //TODO: Add Admin Middleware

// ===============================
// Products - Marketplace
router.post("/cylinder", cylinderController.addCylinders); //TODO: Add Admin Middleware

router.delete("/cylinder/:id", cylinderController.deleteCylinder); //TODO: Add Admin Middleware

router.get("/cylinder/:id", cylinderController.cylinderDetails);

router.patch("/cylinder/:id", cylinderController.updateCylinder); //TODO: Add Admin Middleware

// ==============
// POST IMAGE TO CLOUDINARY
router.post(
  "/uploadimage",
  uploadParser.single("productimg"),
  productsController.uploadImage
);

router.post(
  "/uploadcylinderimage",
  cylinderUploadParser.single("productimg"),
  productsController.uploadImage
);

module.exports = router;
