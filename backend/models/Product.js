const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  category: { type: String, enum: ['Men','Women','Kids'], required: true },
  sizes: [String]
});

module.exports = mongoose.model('Product', ProductSchema);
