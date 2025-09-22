const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

const createValidators = [
  body('customer.name').isString().notEmpty(),
  body('customer.phone').isString().notEmpty(),
  body('customer.address').isString().notEmpty(),
  body('paymentMethod').isIn(['COD']),
  body('items').isArray({ min: 1 }),
  body('items.*.product').isString(),
  body('items.*.quantity').isInt({ min: 1 }),
];

async function create(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const itemsInput = req.body.items;
    const productIds = itemsInput.map((i) => i.product);
    const products = await Product.find({ _id: { $in: productIds } });

    const items = itemsInput.map((i) => {
      const p = products.find((pp) => String(pp._id) === String(i.product));
      if (!p) throw { status: 400, message: 'Invalid product in cart' };
      const quantity = i.quantity;
      return {
        product: p._id,
        name: p.name,
        price: p.price,
        quantity,
        image: p.images?.[0] || '',
      };
    });

    const totalPrice = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

    const order = await Order.create({
      items,
      totalPrice,
      customerName: req.body.customer.name,
      customerPhone: req.body.customer.phone,
      customerAddress: req.body.customer.address,
      paymentMethod: req.body.paymentMethod || 'COD',
      userId: req.user?.id,
    });
    if (req.user?.id) {
      await Cart.findOneAndUpdate({ userId: req.user.id }, { items: [] });
    }
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

async function myOrders(req, res, next) {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name price images');
    if (!order) return res.status(404).json({ error: 'Not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, myOrders, getById, updateStatus, createValidators };


