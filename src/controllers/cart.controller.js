const { body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');

const upsertValidators = [
  body('productId').isString().notEmpty(),
  body('quantity').isInt({ min: 1 }).toInt(),
];

async function getMyCart(req, res, next) {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    res.json(cart || { user: req.user.id, items: [] });
  } catch (err) {
    next(err);
  }
}

async function addOrUpdateItem(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }
    const idx = cart.items.findIndex((it) => String(it.product) === String(productId));
    if (idx >= 0) {
      cart.items[idx].quantity = quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

async function removeItem(req, res, next) {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.json({ user: req.user.id, items: [] });
    cart.items = cart.items.filter((it) => String(it.product) !== String(productId));
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

module.exports = { getMyCart, addOrUpdateItem, removeItem, upsertValidators };


