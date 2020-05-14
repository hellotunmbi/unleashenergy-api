const Products = require("../models/Product");
const asyncHandler = require("../middlewares/async.middleware");
const ErrorResponse = require("../utils/errorResponse");

// List all Products
exports.allProducts = asyncHandler(async (req, res, next) => {
  const products = await Products.find({}).sort({ created_at: "desc" });

  if (products.length === 0) {
    res.json({
      status: 200,
      data: {
        message: "No product found",
      },
    });
  } else if (products.length > 0) {
    res.json({
      status: 200,
      data: {
        message: "Products Found",
        products,
      },
    });
  }
});

// ---------------------------------------------------------

// View single product by id
exports.productDetails = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return next(new ErrorResponse("id not defined", 400));
  }

  const product = await Products.findById(id);

  res.json({
    status: 200,
    data: {
      message: "Product details found",
      product,
    },
  });
});

// ---------------------------------------------------------

// Retrieve products by category
exports.productsByCategory = asyncHandler(async (req, res, next) => {
  const category = req.params.category;

  if (!category) {
    return next(new ErrorResponse("Category parameter required"));
  }

  const products = await Products.find({ category: { $in: category } });

  if (products.length === 0) {
    return next(new ErrorResponse("No product found", 400));
  } else if (products.length > 0) {
    res.json({
      status: 200,
      data: {
        message: "Products Found",
        products,
      },
    });
  }
});

// ---------------------------------------------------------

// Update single product
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new ErrorResponse("id parameter not set"));
  }

  const products = await Products.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true }
  );

  if (!products) {
    return next(new ErrorResponse("No product updated", 400));
  } else {
    res.json({
      status: 200,
      data: {
        message: "Product updated",
        products,
      },
    });
  }
});

// ---------------------------------------------------------

// Add a new product
exports.addProduct = asyncHandler(async (req, res, next) => {
  const { imageURL, title, price, description, category, quantity } = req.body;

  if (!title || !price) {
    return next(
      new ErrorResponse("Title and Price parameters are needed", 400)
    );
  }

  const product = await Products.create({
    imageURL,
    title,
    price,
    description,
    category,
    quantity,
  });

  if (!product) {
    return next(new ErrorResponse("Product could not be created", 400));
  }
  res.json({
    status: 200,
    data: {
      message: "New Product Added",
      product,
    },
  });
});

// ---------------------------------------------------------
// Remove product by id
exports.removeProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return next(new ErrorResponse("No id parameter specified", 400));
  }

  const removed = await Products.findByIdAndDelete(id);

  if (removed) {
    res.json({
      status: 200,
      data: {
        message: "Product successfully removed",
      },
    });
  } else {
    res.json({
      status: 400,
      data: {
        message: "Unable to remove product",
      },
    });
  }
});

// ---------------------------------------------------------
