const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: 'text' },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, enum: ['case', 'earphone', 'charger', 'glass'], required: true, index: true },
    images: [{ type: String }],
    stock: { type: Number, default: 100 },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);


