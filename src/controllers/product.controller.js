const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');

const createValidators = [
  body('name').isString().notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('category').isIn(['case', 'earphone', 'charger', 'glass']),
  body('description').optional().isString(),
  body('stock').optional().isInt({ min: 0 }),
];

const listValidators = [
  query('q').optional().isString(),
  query('category').optional().isIn(['case', 'earphone', 'charger', 'glass']),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

async function create(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    // Xử lý ảnh upload
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    }
    
    const productData = {
      ...req.body,
      images: images
    };
    
    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    // Xử lý ảnh upload cho update
    let updateData = { ...req.body };
    
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      // Nếu có ảnh mới, thay thế hoàn toàn
      updateData.images = newImages;
    } else if (req.body.imageUrl) {
      // Nếu không có file upload nhưng có imageUrl, sử dụng imageUrl
      updateData.images = [req.body.imageUrl];
    }
    
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { q, category, minPrice, maxPrice } = req.query;
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '12');

    const filter = {};
    if (q) filter.$text = { $search: q };
    if (category) filter.category = category;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    res.json({ items, total, page, limit });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, update, remove, getById, list, createValidators, listValidators };


