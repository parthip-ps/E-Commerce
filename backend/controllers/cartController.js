const store = require("../models/store");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const { AppError } = require("../middleware/errorMiddleware");

const calcTotal = (items) =>
  items.reduce((acc, item) => acc + item.price * item.quantity, 0);

// GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  const cart = store.cart.get(req.user.id);
  return sendSuccess(res, { data: { ...cart, total: calcTotal(cart.items) } }, "Cart fetched.");
});

// POST /api/cart/add
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = store.products.findById(productId);
  if (!product) throw new AppError("Product not found.", 404);

  if (product.stock < quantity) {
    return sendError(res, `Only ${product.stock} items in stock.`, 400);
  }

  const cart = store.cart.get(req.user.id);
  const existingIdx = cart.items.findIndex((i) => i.productId === productId);

  if (existingIdx > -1) {
    const newQty = cart.items[existingIdx].quantity + parseInt(quantity);
    if (newQty > product.stock) {
      return sendError(res, `Only ${product.stock} items in stock.`, 400);
    }
    cart.items[existingIdx].quantity = newQty;
  } else {
    cart.items.push({
      productId,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      quantity: parseInt(quantity),
    });
  }

  const updated = store.cart.set(req.user.id, cart);
  return sendSuccess(res, { data: { ...updated, total: calcTotal(updated.items) } }, "Item added to cart.");
});

// PUT /api/cart/update
const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (parseInt(quantity) < 1) {
    return sendError(res, "Quantity must be at least 1.", 400);
  }

  const product = store.products.findById(productId);
  if (!product) throw new AppError("Product not found.", 404);

  if (product.stock < quantity) {
    return sendError(res, `Only ${product.stock} items in stock.`, 400);
  }

  const cart = store.cart.get(req.user.id);
  const idx = cart.items.findIndex((i) => i.productId === productId);
  if (idx === -1) throw new AppError("Item not in cart.", 404);

  cart.items[idx].quantity = parseInt(quantity);
  const updated = store.cart.set(req.user.id, cart);
  return sendSuccess(res, { data: { ...updated, total: calcTotal(updated.items) } }, "Cart updated.");
});

// DELETE /api/cart/remove/:productId
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = store.cart.get(req.user.id);
  cart.items = cart.items.filter((i) => i.productId !== req.params.productId);
  const updated = store.cart.set(req.user.id, cart);
  return sendSuccess(res, { data: { ...updated, total: calcTotal(updated.items) } }, "Item removed.");
});

// DELETE /api/cart/clear
const clearCart = asyncHandler(async (req, res) => {
  const cleared = store.cart.clear(req.user.id);
  return sendSuccess(res, { data: { ...cleared, total: 0 } }, "Cart cleared.");
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
