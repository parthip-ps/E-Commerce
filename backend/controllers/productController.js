const store = require("../models/store");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess, sendError, sendPaginated } = require("../utils/apiResponse");
const { AppError } = require("../middleware/errorMiddleware");

// GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const { category, search, sort, minPrice, maxPrice, featured, page = 1, limit = 12 } = req.query;

  const filters = {
    ...(category && { category }),
    ...(search && { search }),
    ...(sort && { sort }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
    ...(featured !== undefined && { featured: featured === "true" }),
  };

  const allProducts = store.products.findAll(filters);
  const total = allProducts.length;
  const startIndex = (page - 1) * limit;
  const paginated = allProducts.slice(startIndex, startIndex + parseInt(limit));

  return sendPaginated(res, paginated, total, page, limit, "Products fetched.");
});

// GET /api/products/featured
const getFeatured = asyncHandler(async (req, res) => {
  const featured = store.products.findAll({ featured: true });
  return sendSuccess(res, { data: featured.slice(0, 6) }, "Featured products fetched.");
});

// GET /api/products/categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = store.products.getCategories();
  return sendSuccess(res, { data: categories }, "Categories fetched.");
});

// GET /api/products/:id
const getProduct = asyncHandler(async (req, res) => {
  const product = store.products.findById(req.params.id);
  if (!product) throw new AppError("Product not found.", 404);
  return sendSuccess(res, { data: product }, "Product fetched.");
});

// POST /api/products (Admin)
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, originalPrice, category, brand, stock, images, tags, featured } = req.body;

  const product = store.products.create({
    name,
    description,
    price: parseFloat(price),
    originalPrice: parseFloat(originalPrice || price),
    category,
    brand,
    stock: parseInt(stock),
    images: images || [],
    tags: tags || [],
    featured: featured || false,
    rating: 0,
    reviewCount: 0,
  });

  return sendSuccess(res, { data: product }, "Product created.", 201);
});

// PUT /api/products/:id (Admin)
const updateProduct = asyncHandler(async (req, res) => {
  const product = store.products.findById(req.params.id);
  if (!product) throw new AppError("Product not found.", 404);

  const updated = store.products.update(req.params.id, req.body);
  return sendSuccess(res, { data: updated }, "Product updated.");
});

// DELETE /api/products/:id (Admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = store.products.findById(req.params.id);
  if (!product) throw new AppError("Product not found.", 404);

  store.products.delete(req.params.id);
  return sendSuccess(res, {}, "Product deleted.");
});

module.exports = { getProducts, getFeatured, getCategories, getProduct, createProduct, updateProduct, deleteProduct };
